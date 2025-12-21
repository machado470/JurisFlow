import { Controller, Patch, Param, Body } from '@nestjs/common'
import { AssignmentsService } from './assignments.service'
import { RiskLevel } from '@prisma/client'

@Controller('assignments')
export class AssignmentsController {
  constructor(
    private readonly service: AssignmentsService,
  ) {}

  /**
   * Iniciar trilha (primeiro avanço real)
   */
  @Patch(':id/start')
  async start(@Param('id') id: string) {
    return this.service.updateProgress(
      id,
      10,
      RiskLevel.LOW,
    )
  }
}
