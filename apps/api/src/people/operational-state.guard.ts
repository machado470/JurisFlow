import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Inject,
} from '@nestjs/common'
import { OperationalStateService } from './operational-state.service'
import { TimelineService } from '../timeline/timeline.service'

@Injectable()
export class OperationalStateGuard implements CanActivate {
  constructor(
    @Inject(OperationalStateService)
    private readonly operationalState: OperationalStateService,

    @Inject(TimelineService)
    private readonly timeline: TimelineService,
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
      await this.timeline.log({
        action: 'OPERATIONAL_ACCESS_BLOCKED',
        personId: user.personId,
        description: 'Acesso bloqueado: usuário SUSPENDED',
        metadata: {
          state: status.state,
          riskScore: status.riskScore,
          method,
          path,
        },
      })

      throw new ForbiddenException(
        'Usuário suspenso temporariamente.',
      )
    }

    // 🟡 WARNING: tudo passa
    if (status.state === 'WARNING') {
      return true
    }

    // 🔴 RESTRICTED: só ações de regularização
    if (status.state === 'RESTRICTED') {
      const allowed =
        (method === 'POST' &&
          path.includes('/corrective-actions/')) ||
        (method === 'POST' &&
          path.includes('/reassess')) ||
        method === 'GET'

      if (!allowed) {
        await this.timeline.log({
          action: 'OPERATIONAL_ACCESS_BLOCKED',
          personId: user.personId,
          description:
            'Acesso bloqueado: usuário RESTRICTED',
          metadata: {
            state: status.state,
            riskScore: status.riskScore,
            method,
            path,
          },
        })

        throw new ForbiddenException(
          'Ação bloqueada até regularização das pendências.',
        )
      }

      return true
    }

    // 🟢 NORMAL
    return true
  }
}
