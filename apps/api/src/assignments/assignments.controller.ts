import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common'
import { AssignmentsService } from './assignments.service'

@Controller('assignments')
export class AssignmentsController {
  constructor(
    private readonly assignments: AssignmentsService,
  ) {}

  @Get()
  list() {
    return this.assignments.list()
  }

  // ✅ NOVO — atribuir trilha à pessoa
  @Post()
  async assign(
    @Body()
    body: {
      personId: string
      trackId: string
    },
  ) {
    return this.assignments.createIfNotExists(body)
  }

  @Post(':id/start')
  async start(@Param('id') id: string) {
    return this.assignments.start(id)
  }

  @Patch(':id/progress')
  async updateProgress(
    @Param('id') id: string,
    @Body()
    body: { progress: number },
  ) {
    return this.assignments.updateProgress(
      id,
      body.progress,
    )
  }
}
