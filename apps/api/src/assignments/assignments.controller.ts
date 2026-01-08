import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { OperationalStateGuard } from '../people/operational-state.guard'
import { AssignmentsService } from './assignments.service'

@Controller('assignments')
@UseGuards(JwtAuthGuard)
export class AssignmentsController {
  constructor(
    private readonly service: AssignmentsService,
  ) {}

  /**
   * 📋 LISTAGEM POR PESSOA
   */
  @Get('person/:personId')
  async listByPerson(
    @Param('personId') personId: string,
  ) {
    return this.service.listOpenByPerson(personId)
  }

  /**
   * ▶️ INÍCIO DE ASSIGNMENT
   */
  @Post(':id/start')
  @UseGuards(OperationalStateGuard)
  async start(@Param('id') id: string) {
    return this.service.startAssignment(id)
  }

  /**
   * 🔄 ATUALIZA PROGRESSO
   */
  @Patch(':id/progress')
  @UseGuards(OperationalStateGuard)
  async updateProgress(
    @Param('id') id: string,
    @Body() body: { progress: number },
  ) {
    return this.service.updateProgress(id, body.progress)
  }

  /**
   * ✅ CONCLUSÃO DE ASSIGNMENT
   */
  @Post(':id/complete')
  @UseGuards(OperationalStateGuard)
  async complete(@Param('id') id: string) {
    return this.service.completeAssignment(id)
  }
}
