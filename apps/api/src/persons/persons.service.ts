import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class PersonsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.person.findMany({
      orderBy: { createdAt: 'desc' },
    })
  }

  findOne(id: string) {
    return this.prisma.person.findUnique({
      where: { id },
    })
  }

  create(data: {
    name: string
    email?: string
    role: string
  }) {
    return this.prisma.person.create({
      data: {
        name: data.name,
        email: data.email,
        role: data.role,
      },
    })
  }

  setActive(id: string, active: boolean) {
    return this.prisma.person.update({
      where: { id },
      data: { active },
    })
  }

  getAssignments(id: string) {
    return this.prisma.assignment.findMany({
      where: { personId: id },
      include: { track: true },
    })
  }
}
