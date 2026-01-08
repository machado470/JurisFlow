import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { ReportsService } from './reports.service'

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(
    private readonly reports: ReportsService,
  ) {}

  /**
   * �� FOTO EXECUTIVA
   */
  @Get('executive')
  async executive() {
    return this.reports.getExecutiveReport()
  }

  /**
   * 📈 MÉTRICAS EXECUTIVAS
   */
  @Get('executive/metrics')
  async executiveMetrics(
    @Query('days') days?: string,
  ) {
    return this.reports.getExecutiveMetrics(
      days ? Number(days) : 30,
    )
  }
}
