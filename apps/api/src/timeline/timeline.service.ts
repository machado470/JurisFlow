import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { presentAuditEvent } from './timeline.presenter'

@Injectable()
export class TimelineService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async listByPerson(personId: string) {
    const events = await this.prisma.auditEvent.findMany({
      where: { personId },
      include: {
        person: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    return events.map(presentAuditEvent)
  }

  async listGlobal() {
    const events = await this.prisma.auditEvent.findMany({
      include: {
        person: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    return events.map(presentAuditEvent)
  }

  async log(data: {
    action: string
    personId: string
    description?: string
    metadata?: any
  }) {
    return this.prisma.auditEvent.create({
      data: {
        action: data.action,
        personId: data.personId,
        context: data.description,
        metadata: data.metadata,
      },
    })
  }
}
