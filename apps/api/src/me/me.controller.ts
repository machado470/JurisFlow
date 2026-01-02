import {
  Controller,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { AssignmentsService } from '../assignments/assignments.service'

@Controller('me')
@UseGuards(JwtAuthGuard)
export class MeController {
  constructor(
    private readonly assignments: AssignmentsService,
  ) {}

  @Get()
  async me(@Req() req: any) {
    const personId = req.user.personId

    return {
      assignments: personId
        ? await this.assignments.listOpenByPerson(
            personId,
          )
        : [],
    }
  }
}
