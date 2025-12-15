import { Controller, Get, Query } from '@nestjs/common'
import { RiskService } from './risk.service'
import { Public } from '../auth/decorators/public.decorator'

@Public()
@Controller('risk')
export class RiskController {
  constructor(private readonly service: RiskService) {}

  @Get('people')
  list(@Query('orgId') orgId: string) {
    return this.service.listPeopleRisk(orgId)
  }

  @Get('person')
  getPerson(
    @Query('orgId') orgId: string,
    @Query('personId') personId: string,
  ) {
    return this.service
      .listPeopleRisk(orgId)
      .find(p => p.personId === personId)
  }
}
