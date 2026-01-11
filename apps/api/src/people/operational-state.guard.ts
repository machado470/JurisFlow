import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common'
import { OperationalStateService } from './operational-state.service'

@Injectable()
export class OperationalStateGuard implements CanActivate {
  constructor(
    private readonly operationalState: OperationalStateService,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const req = context.switchToHttp().getRequest()
    const user = req.user

    // Admin puro ou usuário sem pessoa vinculada
    if (!user || !user.personId) {
      return true
    }

    const status =
      await this.operationalState.getStatus(
        user.personId,
      )

    const method = req.method
    const path: string = req.route?.path ?? ''

    // 🚫 SUSPENDED: nada passa
    if (status.state === 'SUSPENDED') {
      throw new ForbiddenException(
        status.reason ??
          'Usuário suspenso temporariamente.',
      )
    }

    // 🟡 WARNING: tudo passa (alerta já tratado no /me)
    if (status.state === 'WARNING') {
      return true
    }

    // 🔴 RESTRICTED: só ações de regularização
    if (status.state === 'RESTRICTED') {
      const allowed =
        // resolver ação corretiva
        (method === 'POST' &&
          path.includes(
            '/corrective-actions/',
          )) ||
        // reavaliação explícita
        (method === 'POST' &&
          path.includes('/reassess')) ||
        // leitura básica
        (method === 'GET')

      if (!allowed) {
        throw new ForbiddenException(
          status.reason ??
            'Ação bloqueada até regularização das pendências.',
        )
      }

      return true
    }

    // 🟢 NORMAL
    return true
  }
}
