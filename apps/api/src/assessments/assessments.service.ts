import { Injectable, OnModuleInit } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import { PrismaService } from '../prisma/prisma.service'
import { RiskService } from '../risk/risk.service'
import { RiskSnapshotService } from '../risk/risk-snapshot.service'
import { AuditService } from '../audit/audit.service'
import { CorrectiveActionsService } from '../corrective-actions/corrective-actions.service'
import { RiskLevel } from '@prisma/client'

type SubmitAssessmentDto = {
  assignmentId: string
  score: number
  notes?: string
}

@Injectable()
export class AssessmentsService implements OnModuleInit {
  private corrective!: CorrectiveActionsService

  constructor(
    private readonly prisma: PrismaService,
    private readonly risk: RiskService,
    private readonly snapshots: RiskSnapshotService,
    private readonly audit: AuditService,
    private readonly moduleRef: ModuleRef,
  ) {}

  onModuleInit() {
    this.corrective = this.moduleRef.get(
      CorrectiveActionsService,
      { strict: false },
    )
  }

  private calculateRisk(score: number): RiskLevel {
    if (score >= 80) return RiskLevel.LOW
    if (score >= 60) return RiskLevel.MEDIUM
    if (score >= 40) return RiskLevel.HIGH
    return RiskLevel.CRITICAL
  }

  async submit(dto: SubmitAssessmentDto) {
    const assignment = await this.prisma.assignment.findUnique({
      where: { id: dto.assignmentId },
      include: { person: true, track: true },
    })

    if (!assignment || !assignment.personId) {
      throw new Error('Assignment inválido')
    }

    const risk = this.calculateRisk(dto.score)

    const assessment = await this.prisma.assessment.create({
      data: {
        assignmentId: assignment.id,
        personId: assignment.personId,
        trackId: assignment.trackId,
        score: dto.score,
        risk,
        notes: dto.notes,
      },
    })

    await this.risk.recalculatePersonRisk(
      assignment.personId,
    )

    await this.snapshots.record({
      personId: assignment.personId,
      score: dto.score,
      reason: 'Avaliação submetida',
    })

    await this.audit.log({
      personId: assignment.personId,
      action: 'ASSESSMENT_SUBMITTED',
      context: `assignment=${assignment.id} score=${dto.score}`,
    })

    if (risk === RiskLevel.CRITICAL) {
      await this.corrective.create({
        personId: assignment.personId,
        reason: 'Avaliação com risco crítico',
      })
    }

    return assessment
  }
}
