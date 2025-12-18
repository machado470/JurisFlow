import { Injectable } from '@nestjs/common'
import { RiskService } from '../risk/risk.service'
import { RiskLevel } from '@prisma/client'

@Injectable()
export class ReportsService {
  constructor(
    private readonly risk: RiskService,
  ) {}

  /**
   * Resumo executivo.
   * NUNCA pode quebrar.
   */
  async executiveSummary() {
    let people: any[] = []

    try {
      people = await this.risk.listPeopleRisk()
    } catch (err) {
      console.error('[REPORTS] Erro em listPeopleRisk:', err)
      return {
        totalPeople: 0,
        CRITICAL: 0,
        HIGH: 0,
        MEDIUM: 0,
        LOW: 0,
      }
    }

    const summary = {
      totalPeople: people.length,
      CRITICAL: 0,
      HIGH: 0,
      MEDIUM: 0,
      LOW: 0,
    }

    for (const p of people) {
      const risk =
        p?.risk && RiskLevel[p.risk as RiskLevel]
          ? p.risk
          : RiskLevel.LOW

      summary[risk]++
    }

    return summary
  }

  /**
   * Pessoas em risco.
   * Se der erro, retorna lista vazia.
   */
  async peopleAtRisk() {
    let people: any[] = []

    try {
      people = await this.risk.listPeopleRisk()
    } catch (err) {
      console.error('[REPORTS] Erro em listPeopleRisk:', err)
      return []
    }

    const order = [
      RiskLevel.CRITICAL,
      RiskLevel.HIGH,
      RiskLevel.MEDIUM,
      RiskLevel.LOW,
    ]

    return people.sort((a, b) => {
      const aRisk = a?.risk ?? RiskLevel.LOW
      const bRisk = b?.risk ?? RiskLevel.LOW
      return order.indexOf(aRisk) - order.indexOf(bRisk)
    })
  }
}
