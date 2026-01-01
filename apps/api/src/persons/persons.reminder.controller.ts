import {
  Controller,
  Post,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

@Controller('persons')
@UseGuards(JwtAuthGuard)
export class PersonsReminderController {
  constructor(private readonly prisma: PrismaService) {}

  @Post(':id/reminder')
  async sendReminder(
    @Req() req: any,
    @Param('id') personId: string,
  ) {
    const orgId = req.user.orgId

    const person = await this.prisma.person.findFirst({
      where: { id: personId, orgId },
    })

    if (!person) return { success: false }

    await this.prisma.event.create({
      data: {
        type: 'MANUAL_REMINDER_SENT',
        severity: 'INFO',
        description:
          'Lembrete manual enviado pelo administrador.',
        personId,
        metadata: {
          by: req.user.userId,
        },
      },
    })

    return { success: true }
  }
}
