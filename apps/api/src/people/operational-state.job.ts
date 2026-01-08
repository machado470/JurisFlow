import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { OperationalStateService } from './operational-state.service'
import { RiskService } from '../risk/risk.service'
import { AuditService } from '../audit/audit.service'

@Injectable()
export class OperationalStateJob {
  private readonly logger = new Logger(
    OperationalStateJob.name,
  )

  constructor(
    private readonly prisma: PrismaService,
    private readonly operationalState: OperationalStateService,
    private readonly risk: RiskService,
    private readonly audit: AuditService,
  ) {}

  /**
   * ⏱ JOB REAL
   * Deve ser executado periodicamente
   */
  async run() {
    const now = new Date()

    // 1️⃣ Pessoas que tinham exceção e já expirou
    const expiredExceptions =
      await this.prisma.personException.findMany({
        where: {
          endsAt: { lt: now },
          processedAt: null,
        },
        select: {
          id: true,
          personId: true,
        },
      })

    for (const ex of expiredExceptions) {
      const state =
        await this.operationalState.getState(
          ex.personId,
        )

      // Marca exceção como processada (idempotência)
      await this.prisma.personException.update({
        where: { id: ex.id },
        data: { processedAt: now },
      })

      // Recalcula risco sempre
      const score =
        await this.risk.recalculatePersonRisk(
          ex.personId,
        )

      await this.audit.log({
        action: 'PERSON_EXCEPTION_ENDED',
        personId: ex.personId,
        context: `Exceção expirada. Estado atual: ${state}. Score: ${score}`,
      })

      this.logger.log(
        `Exceção encerrada para ${ex.personId} | estado=${state} score=${score}`,
      )
    }
  }
}
