import { Controller, Post, Body, Req } from '@nestjs/common'
import { AssessmentsService } from './assessments.service'

@Controller('assessments')
export class AssessmentsController {
  constructor(
    private assessments: AssessmentsService,
  ) {}

  @Post()
  create(
    @Req() req: any,
    @Body()
    body: {
      assignmentId: string
      score: number
      notes?: string
    },
  ) {
    return this.assessments.create({
      assignmentId: body.assignmentId,
      score: body.score,
      notes: body.notes,
      personId: req.user.personId,
    })
  }
}

