import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CorrectiveActionsService } from '../corrective-actions/corrective-actions.service'

const CRITICAL_RISK_SCORE = 60

@Injectable()
export class RiskAutomationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly corrective: CorrectiveActionsService,
  ) {}

  async handleCriticalRisk(personId: string) {
    const person = await this.prisma.person.findUnique({
      where: { id: personId },
    })

    if (!person || person.riskScore < CRITICAL_RISK_SCORE) {
      return
    }

    const existing =
      await this.prisma.correctiveAction.findFirst({
        where: {
          personId,
          status: 'OPEN',
        },
      })

    if (existing) return

    await this.corrective.create({
      personId,
      reason:
        'Ação corretiva criada automaticamente devido a risco crítico.',
    })
  }
}
