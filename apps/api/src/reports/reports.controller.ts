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

  @Get('executive')
  async executive(@Req() req: any) {
    const data =
      await this.reports.getExecutiveReport(
        req.user.orgId,
      )

    return {
      success: true,
      data,
    }
  }
}
