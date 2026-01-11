import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import {
  OperationalStateService,
  OperationalStatus,
} from './operational-state.service'
import { AssignmentsService } from '../assignments/assignments.service'
import { CorrectiveActionsService } from '../corrective-actions/corrective-actions.service'
import { RiskService } from '../risk/risk.service'

@Injectable()
export class PeopleOverviewService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly operationalState: OperationalStateService,
    private readonly assignments: AssignmentsService,
    private readonly correctives: CorrectiveActionsService,
    private readonly risk: RiskService,
  ) {}

  async getOverview(personId: string) {
    const person = await this.prisma.person.findUnique({
      where: { id: personId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        riskScore: true,
      },
    })

    if (!person) {
      throw new NotFoundException('Pessoa não encontrada')
    }

    // ----------------------------
    // 🧠 ESTADO OPERACIONAL
    // ----------------------------
    const operational: OperationalStatus =
      await this.operationalState.getStatus(personId)

    // ----------------------------
    // 📚 ASSIGNMENTS
    // ----------------------------
    const rawAssignments =
      await this.assignments.listOpenByPerson(personId)

    const assignments = rawAssignments.map(a => {
      let status:
        | 'NOT_STARTED'
        | 'IN_PROGRESS'
        | 'COMPLETED' = 'NOT_STARTED'

      if (a.progress > 0 && a.progress < 100) {
        status = 'IN_PROGRESS'
      }

      if (a.progress === 100) {
        status = 'COMPLETED'
      }

      return {
        id: a.id,
        progress: a.progress,
        status,
        track: {
          id: a.track.id,
          title: a.track.title,
        },
      }
    })

    // ----------------------------
    // 🛠 AÇÕES CORRETIVAS
    // ----------------------------
    const correctiveActions =
      await this.correctives.listByPerson(personId)

    // ----------------------------
    // ⚠️ RISCO (DERIVADO)
    // ----------------------------
    const riskScore = person.riskScore ?? 0

    let riskLevel:
      | 'LOW'
      | 'MEDIUM'
      | 'HIGH'
      | 'CRITICAL' = 'LOW'

    if (riskScore >= 60) riskLevel = 'CRITICAL'
    else if (riskScore >= 40) riskLevel = 'HIGH'
    else if (riskScore >= 20) riskLevel = 'MEDIUM'

    // ----------------------------
    // 📦 RESPOSTA FINAL
    // ----------------------------
    return {
      person: {
        id: person.id,
        name: person.name,
        email: person.email,
        role: person.role,
      },

      operational,

      risk: {
        score: riskScore,
        level: riskLevel,
      },

      assignments,

      correctiveActions,
    }
  }
}
