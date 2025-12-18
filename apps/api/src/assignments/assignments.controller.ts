import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Req,
} from '@nestjs/common'
import { AssignmentsService } from './assignments.service'
import { RiskLevel } from '@prisma/client'

@Controller('assignments')
export class AssignmentsController {
  constructor(
    private assignments: AssignmentsService,
  ) {}

  @Get()
  list() {
    return this.assignments.list()
  }

  @Get('person/:personId')
  listByPerson(
    @Param('personId') personId: string,
  ) {
    return this.assignments.listByPerson(personId)
  }

  // ✅ COLLABORATOR
  @Get('me')
  myAssignments(@Req() req: any) {
    return this.assignments.listByPerson(
      req.user.personId,
    )
  }

  @Patch(':id/progress')
  updateProgress(
    @Param('id') id: string,
    @Body()
    body: {
      progress: number
      risk: RiskLevel
    },
  ) {
    return this.assignments.updateProgress(
      id,
      body.progress,
      body.risk,
    )
  }
}
