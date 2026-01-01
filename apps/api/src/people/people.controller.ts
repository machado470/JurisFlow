import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common'
import { PeopleService } from './people.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

@Controller('people')
@UseGuards(JwtAuthGuard)
export class PeopleController {
  constructor(private readonly service: PeopleService) {}

  @Get()
  list(@Req() req) {
    return this.service.listByOrg(req.user.orgId)
  }

  @Post()
  create(
    @Req() req,
    @Body()
    body: {
      name: string
      email: string
      role: 'ADMIN' | 'COLLABORATOR'
    },
  ) {
    return this.service.create({
      ...body,
      orgId: req.user.orgId,
    })
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findById(id)
  }

  @Post(':id/offboard')
  offboard(
    @Param('id') id: string,
    @Body('reason') reason: string,
  ) {
    return this.service.offboardPerson(id, reason)
  }
}
