import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { AuditService } from '../audit/audit.service'
import { RiskSnapshotService } from '../risk/risk-snapshot.service'
import { RiskService } from '../risk/risk.service'

type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

@Injectable()
export class AssessmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly riskSnapshots: RiskSnapshotService,
    private readonly risk: RiskService,
  ) {}

  async submit(data: {
    assignmentId: string
    score: number
    notes?: string
  }) {
    const assignment = await this.prisma.assignment.findUnique({
      where: { id: data.assignmentId },
    })

    if (!assignment) {
      throw new NotFoundException('Assignment não encontrado')
    }

    const risk = this.calculateRiskFromScore(data.score)

    const assessment = await this.prisma.assessment.create({
      data: {
        assignmentId: assignment.id,
        personId: assignment.personId,
        trackId: assignment.trackId,
        score: data.score,
        risk,
        notes: data.notes,
      },
    })

    await this.audit.log({
      personId: assignment.personId,
      action: 'ASSESSMENT_SUBMITTED',
      context: `Score ${data.score} · Risco ${risk}`,
    })

    const delta = this.calculateRiskDeltaFromScore(data.score)

    if (delta > 0) {
      await this.prisma.event.create({
        data: {
          personId: assignment.personId,
          type: 'ASSESSMENT_NEGATIVE',
          severity: risk,
          description: `Assessment com score ${data.score}`,
          metadata: { score: data.score, delta },
        },
      })

      await this.riskSnapshots.record({
        personId: assignment.personId,
        score: delta,
        reason: `Assessment score ${data.score}`,
      })

      await this.risk.recalculatePersonRisk(assignment.personId)
    }

    return assessment
  }

  private calculateRiskFromScore(score: number): RiskLevel {
    if (score < 50) return 'HIGH'
    if (score < 70) return 'MEDIUM'
    return 'LOW'
  }

  private calculateRiskDeltaFromScore(score: number): number {
    if (score < 50) return 20
    if (score < 70) return 10
    return 0
  }
}
