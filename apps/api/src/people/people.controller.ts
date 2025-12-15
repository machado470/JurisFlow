import { Controller, Get, Post, Body, Query } from '@nestjs/common'
import { PeopleService } from './people.service'
import { Public } from '../auth/decorators/public.decorator'

@Public()
@Controller('people')
export class PeopleController {
  constructor(private readonly service: PeopleService) {}

  @Get()
  list(@Query('orgId') orgId: string) {
    return this.service.list(orgId)
  }

  @Post()
  create(@Body() data: any) {
    return this.service.create(data)
  }
}
