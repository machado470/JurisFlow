import { Controller, Post, Body } from '@nestjs/common'
import { AssessmentsService } from './assessments.service'

@Controller('assessments')
export class AssessmentsController {
  constructor(
    private readonly service: AssessmentsService,
  ) {}

  /**
   * Avaliação mínima (MVP)
   */
  @Post()
  async submit(
    @Body()
    body: {
      assignmentId: string
      personId: string
      score: number
      notes?: string
    },
  ) {
    return this.service.create(body)
  }
}
