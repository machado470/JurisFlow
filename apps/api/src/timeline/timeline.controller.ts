import {
  Controller,
  Get,
  Param,
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

  @Get('person/:personId')
  async byPerson(
    @Param('personId') personId: string,
  ) {
    return this.timeline.buildForPerson(personId)
  }
}
