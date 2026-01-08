import {
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { RiskService } from '../risk/risk.service'
import { RiskSnapshotService } from '../risk/risk-snapshot.service'
import { AuditService } from '../audit/audit.service'
import { CorrectiveActionsService } from '../corrective-actions/corrective-actions.service'

type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

@Injectable()
export class AssessmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly risk: RiskService,
    private readonly snapshots: RiskSnapshotService,
    private readonly audit: AuditService,
    private readonly corrective: CorrectiveActionsService,
  ) {}

  async submit(params: {
    assignmentId: string
    score: number
  }) {
    const assignment =
      await this.prisma.assignment.findUnique({
        where: { id: params.assignmentId },
        include: {
          person: true,
          track: true,
        },
      })

    if (!assignment) {
      throw new NotFoundException(
        'Assignment não encontrado',
      )
    }

    // ----------------------------
    // 1️⃣ RISCO EDUCACIONAL
    // ----------------------------
    const assessmentRisk: RiskLevel =
      params.score >= 80
        ? 'LOW'
        : params.score >= 60
        ? 'MEDIUM'
        : params.score >= 40
        ? 'HIGH'
        : 'CRITICAL'

    // ----------------------------
    // 2️⃣ CRIAR ASSESSMENT
    // ----------------------------
    const assessment =
      await this.prisma.assessment.create({
        data: {
          score: params.score,
          risk: assessmentRisk,
          assignmentId: assignment.id,
          personId: assignment.personId,
          trackId: assignment.trackId,
        },
      })

    // ----------------------------
    // 3️⃣ PROGRESSO DA TRILHA
    // ----------------------------
    await this.prisma.assignment.update({
      where: { id: assignment.id },
      data: {
        progress: 100,
        risk: assessmentRisk,
      },
    })

    // ----------------------------
    // 4️⃣ RISCO OPERACIONAL
    // ----------------------------
    const operationalScore =
      await this.risk.recalculatePersonRisk(
        assignment.personId,
      )

    // ----------------------------
    // 5️⃣ SNAPSHOT
    // ----------------------------
    await this.snapshots.record({
      personId: assignment.personId,
      score: operationalScore,
      reason: `Avaliação concluída (${params.score} pontos)`,
    })

    // ----------------------------
    // 6️⃣ AUDITORIA
    // ----------------------------
    await this.audit.log({
      action: 'ASSESSMENT_SUBMITTED',
      personId: assignment.personId,
      context: `Avaliação da trilha "${assignment.track.title}" concluída com score ${params.score}`,
    })

    // ----------------------------
    // 7️⃣ AÇÃO CORRETIVA (SE CRÍTICO)
    // ----------------------------
    if (assessmentRisk === 'CRITICAL') {
      await this.prisma.correctiveAction.create({
        data: {
          personId: assignment.personId,
          reason:
            'Risco crítico identificado em avaliação',
          status: 'OPEN',
        },
      })

      await this.audit.log({
        action: 'CORRECTIVE_ACTION_CREATED',
        personId: assignment.personId,
        context:
          'Ação corretiva criada automaticamente após avaliação crítica',
      })

      // ----------------------------
      // 8️⃣ 🔁 REAVALIAÇÃO
      // ----------------------------
      await this.corrective.processReassessment(
        assignment.personId,
      )
    }

    return assessment
  }
}
