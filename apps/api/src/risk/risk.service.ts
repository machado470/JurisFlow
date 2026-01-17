import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { TemporalRiskService } from './temporal-risk.service'

@Injectable()
export class RiskService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly temporalRisk: TemporalRiskService,
  ) {}

  async recalculatePersonRisk(personId: string) {
    const score =
      await this.temporalRisk.calculate(personId)

    await this.snapshot(personId, score)

    return score
  }

  async snapshot(personId: string, score: number) {
    await this.prisma.riskSnapshot.create({
      data: {
        personId,
        score,
        reason: 'Reavaliação automática',
      },
    })

    await this.prisma.timelineEvent.create({
      data: {
        personId,
        action: 'RISK_SNAPSHOT_CREATED',
        metadata: { score },
      },
    })
  }
}
