import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class AssignmentsService {
  constructor(private readonly prisma: PrismaService) {}

  // 🔹 LISTAR TODOS (ADMIN)
  async list() {
    return this.prisma.assignment.findMany({
      include: {
        person: {
          select: { id: true, name: true },
        },
        track: {
          select: { id: true, title: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  // 🔹 LISTAR POR PESSOA (COLLABORATOR)
  async findByPerson(personId: string) {
    return this.prisma.assignment.findMany({
      where: { personId },
      include: {
        track: {
          select: { id: true, title: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  // 🔹 CRIAR ASSIGNMENT SE NÃO EXISTIR
  async createIfNotExists(params: {
    personId: string
    trackId: string
  }) {
    const existing = await this.prisma.assignment.findUnique({
      where: {
        personId_trackId: {
          personId: params.personId,
          trackId: params.trackId,
        },
      },
    })

    if (existing) return existing

    return this.prisma.assignment.create({
      data: {
        personId: params.personId,
        trackId: params.trackId,
      },
    })
  }

  // 🔹 INICIAR EXECUÇÃO
  async start(id: string) {
    return this.prisma.assignment.update({
      where: { id },
      data: {
        progress: 0,
      },
    })
  }

  // 🔹 ATUALIZAR PROGRESSO
  async updateProgress(id: string, progress: number) {
    return this.prisma.assignment.update({
      where: { id },
      data: { progress },
    })
  }
}
