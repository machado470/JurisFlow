import { Body, Controller, Post } from '@nestjs/common'
import { AssessmentsService } from './assessments.service'

@Controller('assessments')
export class AssessmentsController {
  constructor(
    private readonly service: AssessmentsService,
  ) {}

  @Post()
  submit(
    @Body()
    body: {
      assignmentId: string
      score: number
      notes?: string
    },
  ) {
    return this.service.submit(body)
  }
}
