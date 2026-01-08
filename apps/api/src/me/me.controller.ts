import {
  Controller,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { AssignmentsService } from '../assignments/assignments.service'
import {
  OperationalStateService,
  OperationalState,
} from '../people/operational-state.service'
import { PrismaService } from '../prisma/prisma.service'

@Controller('me')
@UseGuards(JwtAuthGuard)
export class MeController {
  constructor(
    private readonly assignments: AssignmentsService,
    private readonly operationalState: OperationalStateService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  async me(@Req() req: any) {
    const { sub, role, orgId, personId } = req.user

    let state: OperationalState = 'NORMAL'

    if (personId) {
      state = await this.operationalState.getState(
        personId,
      )
    }

    const org = await this.prisma.organization.findUnique({
      where: { id: orgId },
      select: { requiresOnboarding: true },
    })

    return {
      user: {
        id: sub,
        role,
        orgId,
        personId,
      },

      assignments: personId
        ? await this.assignments.listOpenByPerson(
            personId,
          )
        : [],

      urgency: state,
      requiresOnboarding:
        org?.requiresOnboarding ?? false,
    }
  }
}
