import { Controller, Get, Post, Param, Req } from '@nestjs/common'
import { StudentsService } from './students.service'
import { Request } from 'express'

@Controller('students')
export class StudentsController {
  constructor(private readonly service: StudentsService) {}

  @Get('me/dashboard')
  async dashboard(@Req() req: Request) {
    const user = req.user as any
    return this.service.getDashboard(user.id)
  }

  @Post('lessons/:lessonId/complete')
  async completeLesson(
    @Req() req: Request,
    @Param('lessonId') lessonId: string,
  ) {
    const user = req.user as any
    return this.service.completeLesson(user.id, lessonId)
  }
}
