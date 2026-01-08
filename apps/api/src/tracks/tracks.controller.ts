import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
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
  async list(@Req() req: any) {
    return this.tracks.listForDashboard(req.user.orgId)
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.tracks.getById(id)
  }

  @Post()
  async create(@Req() req: any, @Body() body: any) {
    return this.tracks.create({
      title: body.title,
      description: body.description,
      orgId: req.user.orgId,
    })
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: { title?: string; description?: string },
  ) {
    return this.tracks.update(id, body)
  }

  @Post(':id/publish')
  async publish(@Param('id') id: string) {
    return this.tracks.publish(id)
  }

  @Post(':id/archive')
  async archive(@Param('id') id: string) {
    return this.tracks.archive(id)
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

  @Post(':id/unassign')
  async unassign(
    @Param('id') trackId: string,
    @Body() body: { personIds: string[] },
  ) {
    return this.tracks.unassignPeople(trackId, body.personIds ?? [])
  }
}
