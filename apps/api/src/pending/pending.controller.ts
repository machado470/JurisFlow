import { Controller, Get, Param } from '@nestjs/common'
import { PendingService } from './pending.service'

@Controller('pending')
export class PendingController {
  constructor(
    private readonly service: PendingService,
  ) {}

  @Get(':orgId')
  list(@Param('orgId') orgId: string) {
    return this.service.list(orgId)
  }
}
