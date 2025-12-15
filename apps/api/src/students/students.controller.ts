import { Controller, Get, Req } from '@nestjs/common'
import { StudentsService } from './students.service'
import { Request } from 'express'

@Controller('students')
export class StudentsController {
  constructor(private readonly service: StudentsService) {}

  @Get('me/dashboard')
  async dashboard(@Req() req: Request) {
    const user = req.user as {
      userId: string
      email: string
      role: string
    }

    return this.service.getDashboard(user.userId)
  }
}
