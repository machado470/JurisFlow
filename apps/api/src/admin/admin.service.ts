import { Injectable } from '@nestjs/common'
import { RiskService } from '../risk/risk.service'

@Injectable()
export class AdminService {
  constructor(private readonly risk: RiskService) {}

  getDashboard(orgId: string) {
    const peopleRisk = this.risk.listPeopleRisk(orgId)

    const total = peopleRisk.length
    const critical = peopleRisk.filter(p => p.risk === 'CRÍTICO').length
    const attention = peopleRisk.filter(p => p.risk === 'ATENÇÃO').length

    const avgRisk =
      critical > 0
        ? 'CRÍTICO'
        : attention > 0
        ? 'ATENÇÃO'
        : 'OK'

    const fitPercentage =
      total === 0
        ? 100
        : Math.round(((total - critical - attention) / total) * 100)

    return {
      avgRisk,
      fitPercentage,
      people: {
        total,
        critical,
        attention,
      },
    }
  }
}
