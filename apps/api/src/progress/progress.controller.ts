import { Controller, Post, Get, Body, Query } from '@nestjs/common'
import { ProgressService } from './progress.service'
import { Public } from '../auth/decorators/public.decorator'

@Public()
@Controller('progress')
export class ProgressController {
  constructor(private readonly service: ProgressService) {}

  @Post()
  set(
    @Body() body: {
      orgId: string
      personId: string
      trackId: string
      value: number
    }
  ) {
    const { orgId, personId, trackId, value } = body
    this.service.set(orgId, personId, trackId, value)
    return { ok: true }
  }

  @Get()
  get(
    @Query('orgId') orgId: string,
    @Query('personId') personId: string,
    @Query('trackId') trackId: string,
  ) {
    return {
      value: this.service.get(orgId, personId, trackId),
    }
  }
}
