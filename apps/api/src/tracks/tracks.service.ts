import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { AuditService } from '../audit/audit.service'

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
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async listForDashboard(orgId: string) {
    const tracks = await this.prisma.track.findMany({
      where: { orgId },
      orderBy: { createdAt: 'desc' },
      include: {
        assignments: { include: { person: true } },
      },
    })

    return tracks.map(t => {
      const total = t.assignments.length
      const completed = t.assignments.filter(a => a.progress === 100).length
      const completionRate =
        total === 0 ? 0 : Math.round((completed / total) * 100)

      return {
        id: t.id,
        title: t.title,
        description: t.description,
        status: t.status,
        version: t.version,
        peopleCount: total,
        completionRate,
      }
    })
  }

  async getById(id: string, orgId: string) {
    return this.prisma.track.findFirstOrThrow({
      where: { id, orgId },
      include: {
        assignments: { include: { person: true } },
      },
    })
  }

  async create(params: { title: string; description?: string; orgId: string }) {
    const baseSlug = slugify(params.title)

    const lastVersion = await this.prisma.track.findFirst({
      where: { slug: baseSlug, orgId: params.orgId },
      orderBy: { version: 'desc' },
    })

    const version = lastVersion ? lastVersion.version + 1 : 1

    const track = await this.prisma.track.create({
      data: {
        title: params.title,
        description: params.description,
        slug: baseSlug,
        version,
        status: 'DRAFT',
        orgId: params.orgId,
      },
    })

    await this.audit.log({
      action: 'TRACK_CREATED',
      context: `Track "${track.title}" v${track.version}`,
    })

    return track
  }

  async update(
    id: string,
    orgId: string,
    params: { title?: string; description?: string },
  ) {
    const track = await this.prisma.track.findFirst({
      where: { id, orgId },
    })

    if (!track) throw new BadRequestException('Trilha não encontrada')
    if (track.status !== 'DRAFT')
      throw new BadRequestException('Somente DRAFT pode ser editada')

    return this.prisma.track.update({
      where: { id },
      data: params,
    })
  }

  async publish(id: string, orgId: string) {
    const track = await this.prisma.track.findFirst({
      where: { id, orgId },
    })

    if (!track) throw new BadRequestException('Trilha não encontrada')
    if (track.status !== 'DRAFT')
      throw new BadRequestException('Apenas DRAFT pode ser publicada')

    return this.prisma.track.update({
      where: { id },
      data: { status: 'ACTIVE' },
    })
  }

  async archive(id: string, orgId: string) {
    const track = await this.prisma.track.findFirst({
      where: { id, orgId },
    })

    if (!track) throw new BadRequestException('Trilha não encontrada')

    const updated = await this.prisma.track.update({
      where: { id },
      data: { status: 'ARCHIVED' },
    })

    await this.prisma.assignment.updateMany({
      where: { trackId: id, progress: { lt: 100 } },
      data: { progress: 100 },
    })

    return updated
  }

  async assignPeople(params: {
    trackId: string
    personIds: string[]
    orgId: string
  }) {
    const track = await this.prisma.track.findFirst({
      where: { id: params.trackId, orgId: params.orgId },
    })

    if (!track || track.status !== 'ACTIVE') {
      throw new BadRequestException('Trilha não ativa')
    }

    const people = await this.prisma.person.findMany({
      where: {
        id: { in: params.personIds },
        orgId: params.orgId,
        active: true,
        role: 'COLLABORATOR',
      },
      select: { id: true },
    })

    const result = await this.prisma.assignment.createMany({
      data: people.map(p => ({
        personId: p.id,
        trackId: params.trackId,
      })),
      skipDuplicates: true,
    })

    return { assigned: result.count }
  }

  async unassignPeople(trackId: string, personIds: string[], orgId: string) {
    await this.prisma.track.findFirstOrThrow({
      where: { id: trackId, orgId },
    })

    const result = await this.prisma.assignment.deleteMany({
      where: { trackId, personId: { in: personIds } },
    })

    return { unassigned: result.count }
  }
}
