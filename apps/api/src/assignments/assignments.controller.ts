import {
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { AssignmentsService } from './assignments.service'

@Controller('assignments')
@UseGuards(JwtAuthGuard)
export class AssignmentsController {
  constructor(
    private readonly service: AssignmentsService,
  ) {}

  @Get('person/:personId')
  async listByPerson(
    @Param('personId') personId: string,
  ) {
    return this.service.listOpenByPerson(personId)
  }

  @Post(':id/start')
  async start(
    @Param('id') id: string,
  ) {
    return this.service.startAssignment(id)
  }

  @Post(':id/complete')
  async complete(
    @Param('id') id: string,
  ) {
    return this.service.completeAssignment(id)
  }
}
