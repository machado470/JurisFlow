import { Controller, Get, UseGuards } from '@nestjs/common'
import { ReportsService } from './reports.service'
import { Org } from '../auth/decorators/org.decorator'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(
    private readonly reports: ReportsService,
  ) {}

  @Get('executive')
  async executive(@Org() orgId: string) {
    const summary =
      await this.reports.executiveSummary(orgId)

    const peopleAtRisk =
      await this.reports.peopleAtRisk(orgId)

    return {
      summary,
      peopleAtRisk,
      generatedAt: new Date(),
    }
  }

  @Get('pending')
  async pending(@Org() orgId: string) {
    return this.reports.pending(orgId)
  }
}
