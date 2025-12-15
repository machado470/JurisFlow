import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common'
import { AssignmentsService } from './assignments.service'
import { Public } from '../auth/decorators/public.decorator'

@Public()
@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly service: AssignmentsService) {}

  @Get()
  list(
    @Query('orgId') orgId: string,
    @Query('personId') personId?: string,
  ) {
    if (personId) {
      return this.service.listByPerson(orgId, personId)
    }
    return this.service.list(orgId)
  }

  @Post()
  create(@Body() data: any) {
    return this.service.createIfNotExists(data)
  }

  @Post(':id/complete')
  complete(@Param('id') id: string) {
    return this.service.complete(id)
  }
}
