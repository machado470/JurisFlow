import { Injectable, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { TimelineService } from '../timeline/timeline.service'

@Injectable()
export class AssignmentFactoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly timeline: TimelineService,
  ) {}

  async assignPeopleToTrack(params: {
    trackId: string
    personIds: string[]
    orgId: string
  }) {
    const track = await this.prisma.track.findFirst({
      where: {
        id: params.trackId,
        orgId: params.orgId,
        status: 'ACTIVE',
      },
    })

    if (!track) {
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

    let created = 0

    for (const person of people) {
      const exists = await this.prisma.assignment.findFirst({
        where: {
          personId: person.id,
          trackId: track.id,
        },
      })

      if (exists) continue

      await this.prisma.assignment.create({
        data: {
          personId: person.id,
          trackId: track.id,
          progress: 0,
        },
      })

      await this.timeline.log({
        action: 'ASSIGNMENT_CREATED',
        personId: person.id,
        description: `Trilha "${track.title}" atribuída`,
        metadata: {
          trackId: track.id,
        },
      })

      created++
    }

    return { assigned: created }
  }
}
