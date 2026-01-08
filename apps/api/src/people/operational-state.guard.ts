import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common'
import { OperationalStateService } from './operational-state.service'

@Injectable()
export class OperationalStateGuard
  implements CanActivate
{
  constructor(
    private readonly operationalState: OperationalStateService,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const req = context
      .switchToHttp()
      .getRequest()

    const user = req.user

    if (!user || !user.personId) {
      return true
    }

    const state =
      await this.operationalState.getState(
        user.personId,
      )

    if (state !== 'NORMAL') {
      throw new ForbiddenException(
        `Ação bloqueada. Estado operacional atual: ${state}`,
      )
    }

    return true
  }
}
