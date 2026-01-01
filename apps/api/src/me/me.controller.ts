import {
  Controller,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { PrismaService } from '../prisma/prisma.service'
import { AssignmentsService } from '../assignments/assignments.service'
import { TemporalRiskService } from '../risk/temporal-risk.service'

@Controller('me')
@UseGuards(JwtAuthGuard)
export class MeController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly temporal: TemporalRiskService,
    private readonly assignments: AssignmentsService,
  ) {}

  @Get()
  async me(@Req() req: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: req.user.sub },
      include: {
        org: true,
        person: true,
      },
    })

    if (!user) return null

    const personId = user.person?.id ?? null

    const urgency = personId
      ? await this.temporal.calculateUrgency(personId)
      : 'NORMAL'

    const assignments = personId
      ? await this.assignments.findByPerson(personId)
      : []

    return {
      id: user.id,
      role: user.role,
      orgId: user.orgId,
      personId,
      requiresOnboarding:
        user.org?.requiresOnboarding ?? false,
      urgency,
      assignments,
    }
  }
}
