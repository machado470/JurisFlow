import { Controller, Get, Query, Req } from '@nestjs/common'
import { ReportsService } from './reports.service'

@Controller('reports')
export class ReportsController {
  constructor(
    private readonly reports: ReportsService,
  ) {}

  @Get('executive')
  async executive(@Req() req: any) {
    return this.reports.getExecutiveReport(
      req.user.orgId,
    )
  }

  @Get('metrics')
  async metrics(
    @Query('days') days?: string,
  ) {
    return this.reports.getExecutiveMetrics(
      days ? Number(days) : 30,
    )
  }
}
