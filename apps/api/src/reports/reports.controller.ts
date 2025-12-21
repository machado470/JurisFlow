import { Controller, Get } from '@nestjs/common'
import { ReportsService } from './reports.service'
import { Public } from '../auth/decorators/public.decorator'

@Controller('reports')
export class ReportsController {
  constructor(
    private readonly reports: ReportsService,
  ) {}

  @Public()
  @Get('executive')
  async executive() {
    const summary = await this.reports.executiveSummary()
    const peopleAtRisk = await this.reports.peopleAtRisk()
    const trackCompliance = await this.reports.trackCompliance()

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
