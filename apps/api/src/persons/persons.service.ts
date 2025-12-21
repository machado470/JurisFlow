import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class PersonsService {
  constructor(private prisma: PrismaService) {}

  findAll(orgId: string) {
    return this.prisma.person.findMany({
      where: { orgId },
      orderBy: { createdAt: 'desc' },
    })
  }

  findOne(id: string, orgId: string) {
    return this.prisma.person.findFirst({
      where: {
        id,
        orgId,
      },
    })
  }

  create(
    orgId: string,
    data: {
      name: string
      email?: string
      role: string
    },
  ) {
    return this.prisma.person.create({
      data: {
        name: data.name,
        email: data.email,
        role: data.role,
        orgId,
      },
    })
  }

  setActive(id: string, orgId: string, active: boolean) {
    return this.prisma.person.updateMany({
      where: {
        id,
        orgId,
      },
      data: { active },
    })
  }

  getAssignments(personId: string, orgId: string) {
    return this.prisma.assignment.findMany({
      where: {
        personId,
        person: { orgId },
      },
      include: { track: true },
    })
  }
}
