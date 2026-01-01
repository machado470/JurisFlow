import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { RiskService } from '../risk/risk.service'
import { RiskSnapshotService } from '../risk/risk-snapshot.service'

@Injectable()
export class CorrectiveActionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly risk: RiskService,
    private readonly snapshots: RiskSnapshotService,
  ) {}

  async listByPerson(personId: string) {
    return this.prisma.correctiveAction.findMany({
      where: { personId },
      orderBy: { createdAt: 'desc' },
    })
  }

  async create(params: { personId: string; reason: string }) {
    const action = await this.prisma.correctiveAction.create({
      data: {
        personId: params.personId,
        reason: params.reason,
        status: 'OPEN',
      },
    })

    await this.prisma.event.create({
      data: {
        type: 'CORRECTIVE_ACTION_CREATED',
        severity: 'WARNING',
        description: 'Ação corretiva criada.',
        personId: params.personId,
      },
    })

    await this.snapshots.record({
      personId: params.personId,
      score: 20,
      reason: 'Ação corretiva criada',
    })

    await this.risk.recalculatePersonRisk(params.personId)

    return action
  }

  async resolve(id: string) {
    const action = await this.prisma.correctiveAction.findUnique({
      where: { id },
    })

    if (!action) {
      throw new NotFoundException('Ação corretiva não encontrada')
    }

    // ✅ Resolver não encerra o ciclo: encerra a "execução", mas exige reavaliação
    const resolved = await this.prisma.correctiveAction.update({
      where: { id },
      data: {
        status: 'AWAITING_REASSESSMENT',
        resolvedAt: new Date(),
      },
    })

    await this.prisma.event.create({
      data: {
        type: 'CORRECTIVE_ACTION_RESOLVED',
        severity: 'INFO',
        description: 'Ação corretiva resolvida.',
        personId: action.personId,
      },
    })

    // 🔁 EXIGÊNCIA INSTITUCIONAL
    await this.prisma.event.create({
      data: {
        type: 'REASSESSMENT_REQUIRED',
        severity: 'WARNING',
        description:
          'Reavaliação obrigatória exigida para encerrar o regime corretivo.',
        personId: action.personId,
      },
    })

    // 🎓 Reabre a trilha mais recentemente avaliada (se existir)
    const lastAssessment = await this.prisma.assessment.findFirst({
      where: { personId: action.personId },
      orderBy: { createdAt: 'desc' },
      select: {
        assignmentId: true,
      },
    })

    if (lastAssessment?.assignmentId) {
      await this.prisma.assignment.update({
        where: { id: lastAssessment.assignmentId },
        data: {
          progress: 0,
          risk: 'LOW',
        },
      })
    }

    await this.snapshots.record({
      personId: action.personId,
      score: -20,
      reason: 'Ação corretiva resolvida (reavaliação pendente)',
    })

    await this.risk.recalculatePersonRisk(action.personId)

    return resolved
  }

  // ✅ Encerramento formal após reavaliação
  async closeAfterReassessment(personId: string) {
    const pending = await this.prisma.correctiveAction.findFirst({
      where: {
        personId,
        status: 'AWAITING_REASSESSMENT',
      },
      orderBy: { createdAt: 'desc' },
    })

    if (!pending) return null

    const closed = await this.prisma.correctiveAction.update({
      where: { id: pending.id },
      data: {
        status: 'DONE',
      },
    })

    await this.prisma.event.create({
      data: {
        type: 'CORRECTIVE_REGIME_CLOSED',
        severity: 'SUCCESS',
        description:
          'Regime corretivo encerrado após reavaliação.',
        personId,
      },
    })

    await this.risk.recalculatePersonRisk(personId)

    return closed
  }

  // ❌ Falha na reavaliação: volta a ser regime corretivo aberto
  async reopenAfterFailedReassessment(personId: string) {
    const pending = await this.prisma.correctiveAction.findFirst({
      where: {
        personId,
        status: 'AWAITING_REASSESSMENT',
      },
      orderBy: { createdAt: 'desc' },
    })

    if (!pending) return null

    const reopened = await this.prisma.correctiveAction.update({
      where: { id: pending.id },
      data: {
        status: 'OPEN',
      },
    })

    await this.prisma.event.create({
      data: {
        type: 'REASSESSMENT_FAILED',
        severity: 'CRITICAL',
        description:
          'Reavaliação falhou. Regime corretivo reaberto.',
        personId,
      },
    })

    await this.risk.recalculatePersonRisk(personId)

    return reopened
  }
}
