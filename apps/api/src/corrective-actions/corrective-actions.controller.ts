import {
  Controller,
  Get,
  Post,
  Param,
  Body,
} from '@nestjs/common'
import { CorrectiveActionsService } from './corrective-actions.service'

@Controller('corrective-actions')
export class CorrectiveActionsController {
  constructor(
    private readonly service: CorrectiveActionsService,
  ) {}

  @Get('person/:personId')
  listByPerson(
    @Param('personId') personId: string,
  ) {
    return this.service.listByPerson(personId)
  }

  @Post()
  create(
    @Body()
    body: {
      personId: string
      reason: string
    },
  ) {
    return this.service.create(body)
  }

  @Post(':id/resolve')
  resolve(@Param('id') id: string) {
    return this.service.resolve(id)
  }
}
