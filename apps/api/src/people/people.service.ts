import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { randomUUID } from 'crypto'

@Injectable()
export class PeopleService {
  constructor(private readonly prisma: PrismaService) {}

  // 🔹 LISTAR POR ORGANIZAÇÃO
  async listByOrg(orgId: string) {
    return this.prisma.person.findMany({
      where: { orgId },
      orderBy: { createdAt: 'desc' },
    })
  }

  // 🔹 CRIAR PESSOA + USUÁRIO (CONVITE)
  async create(params: {
    name: string
    email: string
    role: 'ADMIN' | 'COLLABORATOR'
    orgId: string
  }) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: params.email },
    })

    if (existingUser) {
      throw new BadRequestException('Email já utilizado')
    }

    const inviteToken = randomUUID()

    const person = await this.prisma.person.create({
      data: {
        name: params.name,
        email: params.email,
        role: params.role,
        orgId: params.orgId,
        user: {
          create: {
            email: params.email,
            role: params.role,
            active: false,
            inviteToken,
            inviteExpiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
            orgId: params.orgId,
          },
        },
      },
      include: {
        user: true,
      },
    })

    return {
      personId: person.id,
      inviteLink: `/activate?token=${inviteToken}`,
    }
  }

  // 🔹 BUSCAR POR ID
  async findById(id: string) {
    const person = await this.prisma.person.findUnique({
      where: { id },
      include: {
        events: { orderBy: { createdAt: 'desc' } },
        correctiveActions: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!person) {
      throw new NotFoundException('Pessoa não encontrada')
    }

    return person
  }

  // 🔹 OFFBOARDING
  async offboardPerson(id: string, reason: string) {
    const person = await this.prisma.person.findUnique({ where: { id } })

    if (!person) {
      throw new NotFoundException('Pessoa não encontrada')
    }

    if (person.offboardedAt) return person

    const updated = await this.prisma.person.update({
      where: { id },
      data: {
        active: false,
        offboardedAt: new Date(),
        offboardReason: reason,
      },
    })

    await this.prisma.event.create({
      data: {
        type: 'PERSON_OFFBOARDED',
        severity: 'INFO',
        description: 'Pessoa desligada formalmente.',
        personId: id,
        metadata: { reason },
      },
    })

    return updated
  }
}
