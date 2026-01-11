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
  list(@Req() req: any) {
    return this.tracks.listForDashboard(req.user.orgId)
  }

  @Get(':id')
  get(@Req() req: any, @Param('id') id: string) {
    return this.tracks.getById(id, req.user.orgId)
  }

  @Post()
  create(@Req() req: any, @Body() body: any) {
    return this.tracks.create({
      title: body.title,
      description: body.description,
      orgId: req.user.orgId,
    })
  }

  @Patch(':id')
  update(@Req() req: any, @Param('id') id: string, @Body() body: any) {
    return this.tracks.update(id, req.user.orgId, body)
  }

  @Post(':id/publish')
  publish(@Req() req: any, @Param('id') id: string) {
    return this.tracks.publish(id, req.user.orgId)
  }

  @Post(':id/archive')
  archive(@Req() req: any, @Param('id') id: string) {
    return this.tracks.archive(id, req.user.orgId)
  }

  @Post(':id/assign')
  assign(
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
  unassign(
    @Req() req: any,
    @Param('id') trackId: string,
    @Body() body: { personIds: string[] },
  ) {
    return this.tracks.unassignPeople(
      trackId,
      body.personIds ?? [],
      req.user.orgId,
    )
  }
}
