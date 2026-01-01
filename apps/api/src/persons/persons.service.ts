import { Injectable, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { AssignmentsService } from '../assignments/assignments.service'
import { RiskService } from '../risk/risk.service'
import * as bcrypt from 'bcrypt'

@Injectable()
export class PersonsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly assignments: AssignmentsService,
    private readonly risk: RiskService,
  ) {}

  list(orgId: string) {
    return this.prisma.person.findMany({
      where: { orgId },
      orderBy: { createdAt: 'desc' },
    })
  }

  async getById(personId: string, orgId: string) {
    const person = await this.prisma.person.findFirst({
      where: { id: personId, orgId },
      include: {
        assignments: {
          include: {
            track: true,
            assessments: true,
          },
        },
        correctiveActions: true,
        events: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    })

    if (!person) {
      throw new BadRequestException('Pessoa não encontrada')
    }

    const peopleRisk = await this.risk.listPeopleRisk(orgId)
    const current = peopleRisk.find(
      p => p.personId === personId,
    )

    return {
      ...person,
      riskLevel: current?.risk ?? 'LOW',
    }
  }

  async create(data: {
    name: string
    email: string
    role: 'ADMIN' | 'COLLABORATOR'
    orgId: string
  }) {
    const { name, email, role, orgId } = data

    const org = await this.prisma.organization.findUnique({
      where: { id: orgId },
    })
    if (!org) {
      throw new BadRequestException('Organização não encontrada')
    }

    const existing = await this.prisma.user.findUnique({
      where: { email },
    })
    if (existing) {
      throw new BadRequestException('Email já cadastrado')
    }

    const passwordHash = await bcrypt.hash('123456', 10)

    const user = await this.prisma.user.create({
      data: {
        email,
        password: passwordHash,
        role,
        active: true,
        org: { connect: { id: orgId } },
      },
    })

    const person = await this.prisma.person.create({
      data: {
        name,
        role,
        active: true,
        org: { connect: { id: orgId } },
        user: { connect: { id: user.id } },
      },
    })

    // 🔗 GARANTE RELAÇÃO BIDIRECIONAL
    await this.prisma.user.update({
      where: { id: user.id },
      data: { personId: person.id },
    })

    // 🔥 REGRA FINAL DE ONBOARDING
    if (role === 'ADMIN') {
      const adminCount = await this.prisma.user.count({
        where: {
          orgId,
          role: 'ADMIN',
          active: true,
          personId: { not: null },
        },
      })

      if (adminCount === 1 && org.requiresOnboarding) {
        await this.prisma.organization.update({
          where: { id: orgId },
          data: { requiresOnboarding: false },
        })
      }
    }

    const tracks = await this.prisma.track.findMany()

    for (const track of tracks) {
      await this.assignments.createIfNotExists({
        personId: person.id,
        trackId: track.id,
      })
    }

    return person
  }

  async toggleActive(personId: string, orgId: string) {
    const person = await this.prisma.person.findFirst({
      where: { id: personId, orgId },
    })

    if (!person) {
      throw new BadRequestException('Pessoa não encontrada')
    }

    const updated = await this.prisma.person.update({
      where: { id: personId },
      data: { active: !person.active },
    })

    await this.prisma.event.create({
      data: {
        type: updated.active
          ? 'PERSON_REACTIVATED'
          : 'PERSON_DEACTIVATED',
        severity: 'INFO',
        description: updated.active
          ? 'Pessoa reativada.'
          : 'Pessoa desativada.',
        personId,
      },
    })

    return updated
  }
}
