import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
} from '@nestjs/common'
import { PersonsService } from './persons.service'
import { Org } from '../auth/decorators/org.decorator'

@Controller('persons')
export class PersonsController {
  constructor(private readonly service: PersonsService) {}

  @Get()
  list(@Org() orgId: string) {
    return this.service.findAll(orgId)
  }

  @Get(':id')
  get(
    @Param('id') id: string,
    @Org() orgId: string,
  ) {
    return this.service.findOne(id, orgId)
  }

  @Post()
  create(
    @Org() orgId: string,
    @Body()
    body: { name: string; email?: string; role: string },
  ) {
    return this.service.create(orgId, body)
  }

  @Patch(':id/active')
  setActive(
    @Param('id') id: string,
    @Org() orgId: string,
    @Body() body: { active: boolean },
  ) {
    return this.service.setActive(id, orgId, body.active)
  }

  @Get(':id/assignments')
  assignments(
    @Param('id') id: string,
    @Org() orgId: string,
  ) {
    return this.service.getAssignments(id, orgId)
  }
}
