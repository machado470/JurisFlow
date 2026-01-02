import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { TimelineSeverity } from '@prisma/client'

@Injectable()
export class TimelineService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async log(data: {
    type: string
    personId?: string
    severity?: TimelineSeverity
  }) {
    return this.prisma.event.create({
      data: {
        type: data.type,
        severity:
          data.severity ?? TimelineSeverity.INFO,
        ...(data.personId && {
          person: {
            connect: { id: data.personId },
          },
        }),
      },
    })
  }

  async listByOrg(orgId: string) {
    return this.prisma.event.findMany({
      where: {
        person: { orgId },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    })
  }
}
