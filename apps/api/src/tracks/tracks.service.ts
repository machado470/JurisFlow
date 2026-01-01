import { Injectable, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

@Injectable()
export class TracksService {
  constructor(private readonly prisma: PrismaService) {}

  async list() {
    const tracks = await this.prisma.track.findMany({
      orderBy: { createdAt: 'desc' },
    })

    const assignments = await this.prisma.assignment.groupBy({
      by: ['trackId'],
      _count: true,
    })

    const map = new Map(
      assignments.map(a => [a.trackId, a._count]),
    )

    return tracks.map(t => ({
      ...t,
      assignmentsCount: map.get(t.id) ?? 0,
    }))
  }

  async getById(id: string) {
    return this.prisma.track.findFirstOrThrow({
      where: { id },
    })
  }

  async createAndAssign(params: {
    title: string
    description?: string
    orgId: string
  }) {
    const baseSlug = slugify(params.title)
    let slug = baseSlug

    // 🔐 garante slug único
    let i = 1
    while (
      await this.prisma.track.findUnique({
        where: { slug },
      })
    ) {
      slug = `${baseSlug}-${i++}`
    }

    const track = await this.prisma.track.create({
      data: {
        title: params.title,
        description: params.description,
        slug,
      },
    })

    // 🔥 SOMENTE COLABORADORES ATIVOS
    const collaborators =
      await this.prisma.person.findMany({
        where: {
          orgId: params.orgId,
          active: true,
          role: 'COLLABORATOR',
        },
      })

    if (collaborators.length > 0) {
      await this.prisma.assignment.createMany({
        data: collaborators.map(p => ({
          personId: p.id,
          trackId: track.id,
        })),
        skipDuplicates: true,
      })
    }

    return track
  }

  async assignPeople(params: {
    trackId: string
    personIds: string[]
    orgId: string
  }) {
    await this.prisma.track.findFirstOrThrow({
      where: { id: params.trackId },
    })

    if (params.personIds.length === 0) {
      return { assigned: 0 }
    }

    // 🔥 SOMENTE COLABORADORES ATIVOS DA ORG
    const collaborators =
      await this.prisma.person.findMany({
        where: {
          id: { in: params.personIds },
          orgId: params.orgId,
          active: true,
          role: 'COLLABORATOR',
        },
      })

    if (collaborators.length === 0) {
      return { assigned: 0 }
    }

    const result =
      await this.prisma.assignment.createMany({
        data: collaborators.map(p => ({
          personId: p.id,
          trackId: params.trackId,
        })),
        skipDuplicates: true,
      })

    return { assigned: result.count }
  }
}
