import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { TimelineService } from '../timeline/timeline.service'

@Controller('persons/:personId/timeline')
@UseGuards(JwtAuthGuard)
export class PersonsTimelineController {
  constructor(
    private readonly timeline: TimelineService,
  ) {}

  @Get()
  async list(@Param('personId') personId: string) {
    return this.timeline.listByPerson(personId)
  }
}
