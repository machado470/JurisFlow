import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { RiskLevel } from '@prisma/client'
import { AuditService } from '../audit/audit.service'

@Injectable()
export class AssessmentsService {
  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
  ) {}

  private calculateRisk(score: number): RiskLevel {
    if (score >= 90) return RiskLevel.LOW
    if (score >= 70) return RiskLevel.MEDIUM
    if (score >= 50) return RiskLevel.HIGH
    return RiskLevel.CRITICAL
  }

  async create(params: {
    assignmentId: string
    personId: string
    score: number
    notes?: string
  }) {
    const risk = this.calculateRisk(params.score)

    const assignment =
      await this.prisma.assignment.update({
        where: { id: params.assignmentId },
        data: {
          progress: 100,
          risk,
        },
      })

    const assessment =
      await this.prisma.assessment.create({
        data: {
          assignmentId: assignment.id,
          personId: params.personId,
          trackId: assignment.trackId,
          score: params.score,
          risk,
          notes: params.notes,
        },
      })

    // 🔥 AUDITORIA
    await this.audit.log({
      personId: params.personId,
      action: 'ASSESSMENT_COMPLETED',
      context: `Score: ${params.score} · Risco: ${risk}`,
    })

    return assessment
  }
}
