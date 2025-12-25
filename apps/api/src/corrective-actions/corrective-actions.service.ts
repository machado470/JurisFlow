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

    const resolved = await this.prisma.correctiveAction.update({
      where: { id },
      data: {
        status: 'DONE',
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

    await this.snapshots.record({
      personId: action.personId,
      score: -20,
      reason: 'Ação corretiva resolvida',
    })

    await this.risk.recalculatePersonRisk(action.personId)

    return resolved
  }
}
