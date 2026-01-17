import { Injectable, Inject } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { TemporalRiskService } from '../risk/temporal-risk.service'
import { OperationalStateRepository } from './operational-state.repository'

export type OperationalStateValue =
  | 'NORMAL'
  | 'WARNING'
  | 'RESTRICTED'
  | 'SUSPENDED'

export type OperationalState = {
  state: OperationalStateValue
  riskScore: number
}

@Injectable()
export class OperationalStateService {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService,

    @Inject(TemporalRiskService)
    private readonly temporalRisk: TemporalRiskService,

    private readonly repository: OperationalStateRepository,
  ) {}

  async getStatus(personId: string): Promise<OperationalState> {
    const riskScore =
      await this.temporalRisk.calculate(personId)

    if (riskScore >= 90)
      return { state: 'SUSPENDED', riskScore }

    if (riskScore >= 70)
      return { state: 'RESTRICTED', riskScore }

    if (riskScore >= 50)
      return { state: 'WARNING', riskScore }

    return { state: 'NORMAL', riskScore }
  }
}
