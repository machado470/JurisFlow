import { Controller, Get } from '@nestjs/common'
import { ReportsService } from './reports.service'
import { Org } from '../auth/decorators/org.decorator'

@Controller('reports')
export class ReportsController {
  constructor(
    private readonly reports: ReportsService,
  ) {}

  @Get('executive')
  async executive(@Org() orgId: string) {
    const summary = await this.reports.executiveSummary(orgId)
    const peopleAtRisk = await this.reports.peopleAtRisk(orgId)
    const trackCompliance = await this.reports.trackCompliance(orgId)

    return {
      success: true,
      data: {
        summary,
        trackCompliance,
        peopleAtRisk,
        generatedAt: new Date(),
      },
    }
  }
}
