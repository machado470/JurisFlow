import { Controller, Get, Post, Body, Param } from '@nestjs/common'
import { TracksService } from './tracks.service'

@Controller('tracks')
export class TracksController {
  constructor(
    private readonly tracks: TracksService,
  ) {}

  @Get()
  list() {
    return this.tracks.list()
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.tracks.getById(id)
  }

  @Post()
  create(
    @Body()
    data: {
      title: string
      slug: string
      description?: string
    },
  ) {
    return this.tracks.createAndAssign(data)
  }
}
