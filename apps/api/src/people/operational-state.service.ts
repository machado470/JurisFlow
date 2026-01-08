import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { PersonSuspensionService } from '../risk/person-suspension.service'
import { TemporalRiskService } from '../risk/temporal-risk.service'

export type OperationalState =
  | 'NORMAL'
  | 'SUSPENDED'
  | 'RESTRICTED'

@Injectable()
export class OperationalStateService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly suspension: PersonSuspensionService,
    private readonly temporalRisk: TemporalRiskService,
  ) {}

  /**
   * 🧠 FONTE ÚNICA DE VERDADE
   * Determina o estado operacional atual da pessoa
   */
  async getState(
    personId: string,
  ): Promise<OperationalState> {
    // 1️⃣ Suspensão sempre vence
    const isSuspended =
      await this.suspension.isSuspended(personId)

    if (isSuspended) {
      return 'SUSPENDED'
    }

    // 2️⃣ Risco temporal crítico restringe
    const urgency =
      await this.temporalRisk.calculateUrgency(
        personId,
      )

    if (urgency === 'CRITICAL') {
      return 'RESTRICTED'
    }

    // 3️⃣ Ações corretivas abertas também restringem
    const openCorrectives =
      await this.prisma.correctiveAction.count({
        where: {
          personId,
          status: 'OPEN',
        },
      })

    if (openCorrectives > 0) {
      return 'RESTRICTED'
    }

    // 4️⃣ Estado normal
    return 'NORMAL'
  }
}
