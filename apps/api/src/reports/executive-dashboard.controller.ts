import {
  Controller,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { ExecutiveDashboardService } from './executive-dashboard.service'

@Controller('reports/executive')
@UseGuards(JwtAuthGuard)
export class ExecutiveDashboardController {
  constructor(
    private readonly dashboard: ExecutiveDashboardService,
  ) {}

  @Get()
  async overview(@Req() req: any) {
    const { orgId } = req.user
    return this.dashboard.getOverview(orgId)
  }
}
