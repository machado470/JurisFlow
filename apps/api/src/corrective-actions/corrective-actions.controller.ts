import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { CorrectiveActionsService } from './corrective-actions.service'

@Controller('corrective-actions')
@UseGuards(JwtAuthGuard)
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
    return this.service.create({
      personId: body.personId,
      reason: body.reason,
    })
  }

  @Post(':id/resolve')
  resolve(@Param('id') id: string) {
    return this.service.resolve(id)
  }
}
