import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { RiskService } from './risk.service'
import { RiskSnapshotService } from './risk-snapshot.service'
import { RiskAutomationService } from './risk-automation.service'

const DAYS_ASSIGNMENT_INERTIA = 7
const DAYS_CORRECTIVE_OVERDUE = 5

export type UrgencyLevel = 'NORMAL' | 'WARNING' | 'CRITICAL'

@Injectable()
export class TemporalRiskService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly risk: RiskService,
    private readonly snapshots: RiskSnapshotService,
    private readonly automation: RiskAutomationService,
  ) {}

  // 🔹 MÉTODO DE LEITURA (USADO PELO /me)
  async calculateUrgency(
    personId?: string | null,
  ): Promise<UrgencyLevel> {
    if (!personId) return 'NORMAL'

    const openActions =
      await this.prisma.correctiveAction.count({
        where: {
          personId,
          status: 'OPEN',
        },
      })

    if (openActions > 0) {
      return 'CRITICAL'
    }

    const inactiveAssignments =
      await this.prisma.assignment.count({
        where: {
          personId,
          progress: { lt: 100 },
          updatedAt: {
            lt: new Date(
              Date.now() -
                DAYS_ASSIGNMENT_INERTIA *
                  24 *
                  60 *
                  60 *
                  1000,
            ),
          },
        },
      })

    if (inactiveAssignments > 0) {
      return 'WARNING'
    }

    return 'NORMAL'
  }

  // 🔹 AVALIAÇÃO TEMPORAL (EFEITO COLATERAL)
  async evaluatePerson(personId: string) {
    const now = new Date()

    const activeException =
      await this.prisma.personException.findFirst({
        where: {
          personId,
          startsAt: { lte: now },
          endsAt: { gte: now },
        },
      })

    if (activeException) return

    await this.checkAssignmentInertia(personId)
    await this.checkCorrectiveOverdue(personId)
    await this.automation.handleCriticalRisk(personId)
  }

  private async checkAssignmentInertia(personId: string) {
    const assignments =
      await this.prisma.assignment.findMany({
        where: {
          personId,
          progress: { lt: 100 },
        },
      })

    const now = Date.now()

    for (const assignment of assignments) {
      const daysInactive =
        (now - assignment.updatedAt.getTime()) /
        (1000 * 60 * 60 * 24)

      if (daysInactive < DAYS_ASSIGNMENT_INERTIA) continue

      await this.snapshots.record({
        personId,
        score: 10,
        reason: 'Inércia em atividade obrigatória',
      })

      await this.risk.recalculatePersonRisk(personId)
    }
  }

  private async checkCorrectiveOverdue(personId: string) {
    const actions =
      await this.prisma.correctiveAction.findMany({
        where: {
          personId,
          status: 'OPEN',
        },
      })

    const now = Date.now()

    for (const action of actions) {
      const daysOpen =
        (now - action.createdAt.getTime()) /
        (1000 * 60 * 60 * 24)

      if (daysOpen < DAYS_CORRECTIVE_OVERDUE) continue

      await this.snapshots.record({
        personId,
        score: 15,
        reason: 'Ação corretiva em atraso',
      })

      await this.risk.recalculatePersonRisk(personId)
    }
  }
}
