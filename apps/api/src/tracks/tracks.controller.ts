import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { TracksService } from './tracks.service'

@Controller('tracks')
@UseGuards(JwtAuthGuard)
export class TracksController {
  constructor(private readonly tracks: TracksService) {}

  @Get()
  async list() {
    return this.tracks.list()
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.tracks.getById(id)
  }

  @Post()
  async create(@Req() req: any, @Body() body: any) {
    return this.tracks.createAndAssign({
      title: body.title,
      description: body.description,
      orgId: req.user.orgId,
    })
  }

  @Post(':id/assign')
  async assign(
    @Req() req: any,
    @Param('id') trackId: string,
    @Body() body: { personIds: string[] },
  ) {
    return this.tracks.assignPeople({
      trackId,
      personIds: body.personIds ?? [],
      orgId: req.user.orgId,
    })
  }
}
