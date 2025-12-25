import { Injectable, Inject, forwardRef, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { AssignmentsService } from '../assignments/assignments.service'

@Injectable()
export class TracksService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => AssignmentsService))
    private readonly assignments: AssignmentsService,
  ) {}

  list() {
    return this.prisma.track.findMany({
      orderBy: { createdAt: 'desc' },
    })
  }

  async getById(trackId: string) {
    const track = await this.prisma.track.findUnique({
      where: { id: trackId },
      include: {
        assignments: {
          include: {
            person: true,
          },
        },
      },
    })

    if (!track) {
      throw new NotFoundException('Trilha não encontrada')
    }

    return {
      id: track.id,
      title: track.title,
      description: track.description,
      people: track.assignments.map(a => ({
        personId: a.person.id,
        name: a.person.name,
        role: a.person.role,
        progress: a.progress,
      })),
    }
  }

  async createAndAssign(data: {
    title: string
    slug: string
    description?: string
  }) {
    const track = await this.prisma.track.create({
      data,
    })

    const people = await this.assignments.getActivePeople()

    for (const person of people) {
      await this.assignments.createIfNotExists({
        personId: person.id,
        trackId: track.id,
      })
    }

    return track
  }
}
