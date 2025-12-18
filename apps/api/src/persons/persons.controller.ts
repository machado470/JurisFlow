import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
} from '@nestjs/common'
import { PersonsService } from './persons.service'

@Controller('persons')
export class PersonsController {
  constructor(private readonly service: PersonsService) {}

  @Get()
  list() {
    return this.service.findAll()
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.service.findOne(id)
  }

  @Post()
  create(
    @Body()
    body: { name: string; email?: string; role: string }
  ) {
    return this.service.create(body)
  }

  @Patch(':id/active')
  setActive(
    @Param('id') id: string,
    @Body() body: { active: boolean }
  ) {
    return this.service.setActive(id, body.active)
  }

  @Get(':id/assignments')
  assignments(@Param('id') id: string) {
    return this.service.getAssignments(id)
  }
}
