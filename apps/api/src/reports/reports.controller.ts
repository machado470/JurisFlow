import {
  Controller,
  Get,
  Req,
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

  // 📊 Relatório executivo (risco operacional)
  @Get('executive')
  executive(@Req() req: any) {
    return this.reports.executive(req.user.orgId)
  }
}
