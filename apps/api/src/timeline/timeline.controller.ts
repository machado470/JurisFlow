import {
  Controller,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { TimelineService } from './timeline.service'

@Controller('timeline')
@UseGuards(JwtAuthGuard)
export class TimelineController {
  constructor(
    private readonly timeline: TimelineService,
  ) {}

  @Get('org')
  async listByOrg(@Req() req: any) {
    return this.timeline.listByOrg(req.user.orgId)
  }
}
