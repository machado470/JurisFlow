import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
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
      include: { person: true },
    })

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado')
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      throw new UnauthorizedException('Senha inválida')
    }

    const payload = {
      sub: user.id,
      role: user.role,
      personId: user.personId,
    }

    return {
      token: this.jwt.sign(payload),
      user: {
        id: user.id,
        role: user.role,
        personId: user.personId,
      },
    }
  }
}
