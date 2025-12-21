import { Controller, Get, Req } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Controller('me')
export class MeController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('assignments')
  async assignments(@Req() req: any) {
    const userId = req.user?.sub

    if (!userId) {
      return []
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        person: true,
      },
    })

    if (!user?.personId) {
      return []
    }

    return this.prisma.assignment.findMany({
      where: { personId: user.personId },
      include: {
        track: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    })
  }
}
