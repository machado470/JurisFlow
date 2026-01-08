import {
  BadRequestException,
  Injectable,
} from '@nestjs/common'
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

type TrackStatus = 'DRAFT' | 'ACTIVE' | 'ARCHIVED'

@Injectable()
export class TracksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async listForDashboard(orgId: string) {
    // ⚠️ Nota: Track ainda não tem orgId no schema.
    // Hoje isso lista trilhas globais. Para produção de verdade, Track precisa ter orgId.
    const tracks = await this.prisma.track.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        assignments: {
          include: { person: true },
        },
      },
    })

    return tracks.map(t => {
      const total = t.assignments.length
      const completed = t.assignments.filter(
        a => a.progress === 100,
      ).length

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

  async getById(id: string) {
    return this.prisma.track.findFirstOrThrow({
      where: { id },
      include: {
        assignments: {
          include: { person: true },
        },
      },
    })
  }

  async create(params: {
    title: string
    description?: string
    orgId: string
  }) {
    const baseSlug = slugify(params.title)

    const lastVersion = await this.prisma.track.findFirst({
      where: { slug: baseSlug },
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
      },
    })

    await this.audit.log({
      action: 'TRACK_CREATED',
      context: `Trilha criada: "${track.title}" (slug=${track.slug} v${track.version}) status=${track.status}`,
    })

    return track
  }

  async update(
    id: string,
    params: { title?: string; description?: string },
  ) {
    const track = await this.prisma.track.findUnique({
      where: { id },
      select: { id: true, status: true, title: true, slug: true, version: true },
    })

    if (!track) {
      throw new BadRequestException('Trilha não encontrada')
    }

    if (track.status !== 'DRAFT') {
      throw new BadRequestException(
        'Somente trilhas em rascunho (DRAFT) podem ser editadas',
      )
    }

    const updated = await this.prisma.track.update({
      where: { id },
      data: {
        title: params.title,
        description: params.description,
      },
    })

    await this.audit.log({
      action: 'TRACK_UPDATED',
      context: `Trilha editada (DRAFT): "${track.title}" (slug=${track.slug} v${track.version})`,
    })

    return updated
  }

  async publish(id: string) {
    const track = await this.prisma.track.findUnique({
      where: { id },
    })

    if (!track) {
      throw new BadRequestException('Trilha não encontrada')
    }

    if (track.status !== 'DRAFT') {
      throw new BadRequestException(
        'Apenas trilhas em rascunho (DRAFT) podem ser publicadas',
      )
    }

    const updated = await this.prisma.track.update({
      where: { id },
      data: { status: 'ACTIVE' },
    })

    await this.audit.log({
      action: 'TRACK_PUBLISHED',
      context: `Trilha publicada: "${track.title}" (slug=${track.slug} v${track.version})`,
    })

    return updated
  }

  async archive(id: string) {
    const track = await this.prisma.track.findUnique({
      where: { id },
    })

    if (!track) {
      throw new BadRequestException('Trilha não encontrada')
    }

    if (track.status === 'ARCHIVED') {
      return {
        success: true,
        message: 'Trilha já estava arquivada',
        closedAssignments: 0,
        track,
      }
    }

    // 1) Arquivar trilha
    const updated = await this.prisma.track.update({
      where: { id },
      data: { status: 'ARCHIVED' },
    })

    // 2) Encerrar assignments abertos (não deletar: manter evidência)
    const closeResult = await this.prisma.assignment.updateMany({
      where: {
        trackId: id,
        progress: { lt: 100 },
      },
      data: {
        progress: 100,
      },
    })

    await this.audit.log({
      action: 'TRACK_ARCHIVED',
      context: `Trilha arquivada: "${track.title}" (slug=${track.slug} v${track.version}) | assignments encerrados=${closeResult.count}`,
    })

    return {
      success: true,
      message: 'Trilha arquivada e assignments encerrados',
      closedAssignments: closeResult.count,
      track: updated,
    }
  }

  async assignPeople(params: {
    trackId: string
    personIds: string[]
    orgId: string
  }) {
    if (!params.personIds || params.personIds.length === 0) {
      return { assigned: 0 }
    }

    const track = await this.prisma.track.findUnique({
      where: { id: params.trackId },
    })

    if (!track || (track.status as TrackStatus) !== 'ACTIVE') {
      throw new BadRequestException('Trilha não está ativa (ACTIVE)')
    }

    // ⚠️ Aqui ainda falta validar orgId de verdade (Track não tem orgId no schema).
    // Mantemos o filtro em Person pra não atribuir gente de outra org.
    const people = await this.prisma.person.findMany({
      where: {
        id: { in: params.personIds },
        orgId: params.orgId,
        active: true,
        role: 'COLLABORATOR',
      },
      select: { id: true },
    })

    if (people.length === 0) {
      return { assigned: 0 }
    }

    const result = await this.prisma.assignment.createMany({
      data: people.map(p => ({
        personId: p.id,
        trackId: params.trackId,
      })),
      skipDuplicates: true,
    })

    await this.audit.log({
      action: 'TRACK_ASSIGNED',
      context: `Atribuição em trilha "${track.title}" (slug=${track.slug} v${track.version}) | assigned=${result.count}`,
    })

    return { assigned: result.count }
  }

  async unassignPeople(trackId: string, personIds: string[]) {
    if (!personIds || personIds.length === 0) {
      return { unassigned: 0 }
    }

    const track = await this.prisma.track.findUnique({
      where: { id: trackId },
    })

    if (!track || (track.status as TrackStatus) !== 'ACTIVE') {
      throw new BadRequestException('Trilha não está ativa (ACTIVE)')
    }

    // Remover atribuições (isso é uma ação administrativa legítima)
    const result = await this.prisma.assignment.deleteMany({
      where: {
        trackId,
        personId: { in: personIds },
      },
    })

    await this.audit.log({
      action: 'TRACK_UNASSIGNED',
      context: `Remoção de atribuição em trilha "${track.title}" (slug=${track.slug} v${track.version}) | unassigned=${result.count}`,
    })

    return { unassigned: result.count }
  }
}
