import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class PersonsService {
  constructor(private readonly prisma: PrismaService) {}

  // 🔹 VINCULAR PERSON A USER (USANDO RELAÇÃO)
  async linkPersonToUser(params: {
    userId: string
    personId: string
  }) {
    const user = await this.prisma.user.findUnique({
      where: { id: params.userId },
      include: { person: true },
    })

    if (!user) {
      throw new NotFoundException('Usuário não encontrado')
    }

    if (user.person) {
      throw new BadRequestException('Usuário já vinculado a uma pessoa')
    }

    const person = await this.prisma.person.findUnique({
      where: { id: params.personId },
    })

    if (!person) {
      throw new NotFoundException('Pessoa não encontrada')
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        person: {
          connect: { id: person.id },
        },
      },
    })

    return { success: true }
  }

  // 🔹 CONTAR USUÁRIOS COM PERSON VINCULADA
  async countUsersWithPerson() {
    return this.prisma.user.count({
      where: {
        person: {
          isNot: null,
        },
      },
    })
  }

  // 🔹 LISTAR PESSOAS ATIVAS
  async listActive() {
    return this.prisma.person.findMany({
      where: { active: true },
      orderBy: { createdAt: 'desc' },
    })
  }

  // 🔹 BUSCAR PESSOA COM CONTEXTO
  async findWithContext(id: string) {
    const person = await this.prisma.person.findUnique({
      where: { id },
      include: {
        user: true,
        events: { orderBy: { createdAt: 'desc' } },
        correctiveActions: { orderBy: { createdAt: 'desc' } },
      },
    })

    if (!person) {
      throw new NotFoundException('Pessoa não encontrada')
    }

    return person
  }
}
