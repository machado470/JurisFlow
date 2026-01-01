import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

@Injectable()
export class PendingService {
  constructor(private readonly prisma: PrismaService) {}

  async list(orgId: string) {
    const assignments = await this.prisma.assignment.findMany({
      where: {
        person: { orgId },
        progress: { lt: 100 },
      },
      include: { person: true, track: true },
    })

    return assignments.map(a => ({
      assignmentId: a.id,
      person: a.person.name,
      track: a.track.title,
      progress: a.progress,
      risk: a.risk as RiskLevel,
    }))
  }
}
