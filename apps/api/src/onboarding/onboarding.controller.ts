import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  BadRequestException,
} from '@nestjs/common'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { PrismaService } from '../prisma/prisma.service'

@Controller('onboarding')
@UseGuards(JwtAuthGuard)
export class OnboardingController {
  constructor(private readonly prisma: PrismaService) {}

  @Post('admin')
  async completeAdmin(
    @Req() req: any,
    @Body() body: { name: string },
  ) {
    const userId = req.user?.sub
    if (!userId) {
      throw new BadRequestException('Usuário inválido')
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { org: true },
    })

    if (!user) {
      throw new BadRequestException('Usuário não encontrado')
    }

    if (user.personId) {
      throw new BadRequestException(
        'Onboarding já concluído',
      )
    }

    const person = await this.prisma.person.create({
      data: {
        name: body.name,
        role: 'ADMIN',
        active: true,
        org: { connect: { id: user.orgId } },
        user: { connect: { id: user.id } },
      },
    })

    await this.prisma.user.update({
      where: { id: user.id },
      data: { personId: person.id },
    })

    if (user.org.requiresOnboarding) {
      await this.prisma.organization.update({
        where: { id: user.orgId },
        data: { requiresOnboarding: false },
      })
    }

    /**
     * 🔑 REGRA FINAL:
     * depois de concluir onboarding,
     * o backend devolve o estado atualizado
     */
    const updated = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { org: true, person: true },
    })

    return {
      ok: true,
      user: {
        id: updated!.id,
        role: updated!.role,
        personId: updated!.personId,
      },
      org: {
        id: updated!.org.id,
        requiresOnboarding: updated!.org.requiresOnboarding,
      },
    }
  }
}
