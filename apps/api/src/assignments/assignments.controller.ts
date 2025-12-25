import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common'
import { AssignmentsService } from './assignments.service'

type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

@Controller('assignments')
export class AssignmentsController {
  constructor(
    private readonly assignments: AssignmentsService,
  ) {}

  @Get()
  list() {
    return this.assignments.list()
  }

  @Post()
  async create(
    @Body()
    body: {
      personId: string
      trackId: string
    },
  ) {
    return this.assignments.createIfNotExists(body)
  }

  @Patch(':id/progress')
  async updateProgress(
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
