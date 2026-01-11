import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import {
  TemporalRiskService,
  TemporalRiskResult,
} from '../risk/temporal-risk.service'
import { TimelineService } from '../timeline/timeline.service'
import { OperationalStateRepository } from './operational-state.repository'

export type OperationalState =
  | 'NORMAL'
  | 'WARNING'
  | 'RESTRICTED'
  | 'SUSPENDED'

export type OperationalStatus = {
  state: OperationalState
  reason?: string
  metadata?: Record<string, any>
}

@Injectable()
export class OperationalStateService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly temporalRisk: TemporalRiskService,
    private readonly timeline: TimelineService,
    private readonly repo: OperationalStateRepository,
  ) {}

  async getStatus(personId: string): Promise<OperationalStatus> {
    const computed = await this.computeStatus(personId)
    const last = await this.repo.getLastState(personId)

    // 🔁 Log APENAS de transição de estado (anti-spam)
    if (last !== computed.state) {
      await this.timeline.log({
        action: 'OPERATIONAL_STATE_CHANGED',
        personId,
        description: computed.reason,
        metadata: {
          from: last,
          to: computed.state,
          ...computed.metadata,
        },
      })
    }

    return computed
  }

  private async computeStatus(
    personId: string,
  ): Promise<OperationalStatus> {
    // 1️⃣ RISCO TEMPORAL (FATO)
    const temporal: TemporalRiskResult =
      await this.temporalRisk.calculateUrgency(
        personId,
      )

    if (temporal.level === 'CRITICAL') {
      return {
        state: 'RESTRICTED',
        reason:
          'Risco crítico por inatividade prolongada',
        metadata: {
          trigger: 'TEMPORAL_RISK',
          ...temporal,
        },
      }
    }

    if (temporal.level === 'WARNING') {
      return {
        state: 'WARNING',
        reason:
          'Risco elevado por atraso em atividades',
        metadata: {
          trigger: 'TEMPORAL_RISK',
          ...temporal,
        },
      }
    }

    // 2️⃣ AÇÕES CORRETIVAS ABERTAS (FATO)
    const openCorrectives =
      await this.prisma.correctiveAction.count({
        where: {
          personId,
          status: 'OPEN',
        },
      })

    if (openCorrectives > 0) {
      return {
        state: 'RESTRICTED',
        reason:
          'Existem ações corretivas abertas pendentes',
        metadata: {
          trigger: 'OPEN_CORRECTIVE',
          count: openCorrectives,
        },
      }
    }

    // 3️⃣ ESTADO NORMAL
    return {
      state: 'NORMAL',
    }
  }
}
