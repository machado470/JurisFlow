import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs'
import { randomUUID } from 'crypto'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    })

    if (!user || !user.password) {
      throw new UnauthorizedException('Usuário inválido')
    }

    if (!user.active) {
      throw new UnauthorizedException(
        'Conta ainda não ativada',
      )
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      throw new UnauthorizedException('Senha inválida')
    }

    const token = this.jwt.sign({
      sub: user.id,
      role: user.role,
      orgId: user.orgId,
      personId: user.personId,
    })

    return {
      token,
      user: {
        id: user.id,
        role: user.role,
        orgId: user.orgId,
        personId: user.personId,
      },
    }
  }

  async inviteCollaborator(email: string, personId: string) {
    const token = randomUUID()

    const user = await this.prisma.user.update({
      where: { email },
      data: {
        inviteToken: token,
        inviteExpiresAt: new Date(
          Date.now() + 1000 * 60 * 60 * 24,
        ), // 24h
        active: false,
      },
    })

    return {
      inviteLink: `/activate?token=${token}`,
      userId: user.id,
    }
  }

  async activateAccount(token: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { inviteToken: token },
    })

    if (
      !user ||
      !user.inviteExpiresAt ||
      user.inviteExpiresAt < new Date()
    ) {
      throw new BadRequestException('Convite inválido')
    }

    const passwordHash = await bcrypt.hash(password, 10)

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: passwordHash,
        active: true,
        inviteToken: null,
        inviteExpiresAt: null,
      },
    })

    return { success: true }
  }
}
