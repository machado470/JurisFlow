import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { TimelineService } from '../timeline/timeline.service'
import { OperationalStateService } from '../people/operational-state.service'

@Injectable()
export class CorrectiveActionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly timeline: TimelineService,
    private readonly operationalState: OperationalStateService,
  ) {}

  async listByPerson(personId: string) {
    return this.prisma.correctiveAction.findMany({
      where: { personId },
      orderBy: { createdAt: 'desc' },
    })
  }

  async resolve(id: string) {
    const action =
      await this.prisma.correctiveAction.findUnique({
        where: { id },
      })

    if (!action) return null

    const resolvedAt = new Date()

    const resolved =
      await this.prisma.correctiveAction.update({
        where: { id },
        data: {
          status: 'DONE',
          resolvedAt,
        },
      })

    // 🔄 Reavaliar estado operacional (fonte única)
    const newStatus =
      await this.operationalState.getStatus(
        action.personId,
      )

    // 🧾 Linha do tempo explicável
    await this.timeline.log({
      action: 'CORRECTIVE_ACTION_RESOLVED',
      personId: action.personId,
      description: action.reason,
      metadata: {
        resolvedAt,
        resultingState: newStatus.state,
        riskScore: newStatus.riskScore,
      },
    })

    return resolved
  }

  /**
   * 🔁 Compatibilidade explícita
   * Usado por fluxos antigos / assessments
   */
  async processReassessment(
    correctiveActionId: string,
  ) {
    return this.resolve(correctiveActionId)
  }
}
