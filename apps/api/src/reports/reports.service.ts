import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { ExecutiveMetricsService } from './executive-metrics.service'
import { TimelineService } from '../timeline/timeline.service'
import { OperationalStateService } from '../people/operational-state.service'

type Urgency =
  | 'OK'
  | 'WARNING'
  | 'CRITICAL'

@Injectable()
export class ReportsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly operationalState: OperationalStateService,
    private readonly metrics: ExecutiveMetricsService,
    private readonly timeline: TimelineService,
  ) {}

  async getExecutiveReport(orgId: string) {
    const people = await this.prisma.person.findMany({
      where: { orgId },
      select: { id: true, name: true },
    })

    const peopleStats: Record<Urgency, number> = {
      OK: 0,
      WARNING: 0,
      CRITICAL: 0,
    }

    const peopleView: {
      id: string
      name: string
      status: Urgency
    }[] = []

    for (const p of people) {
      const operational =
        await this.operationalState.getStatus(p.id)

      let status: Urgency = 'OK'

      if (operational.state === 'WARNING') {
        status = 'WARNING'
      }

      if (
        operational.state === 'RESTRICTED' ||
        operational.state === 'SUSPENDED'
      ) {
        status = 'CRITICAL'
      }

      peopleStats[status]++
      peopleView.push({
        id: p.id,
        name: p.name,
        status,
      })
    }

    const correctiveOpenCount =
      await this.prisma.correctiveAction.count({
        where: {
          status: 'OPEN',
          person: { orgId },
        },
      })

    const tracks = await this.prisma.track.findMany({
      where: { orgId },
      include: { assignments: true },
      orderBy: { createdAt: 'desc' },
    })

    const tracksView = tracks.map(t => {
      const count = t.assignments.length
      const rate =
        count === 0
          ? 0
          : Math.round(
              t.assignments.reduce(
                (s, a) => s + a.progress,
                0,
              ) / count,
            )

      let status:
        | 'SUCCESS'
        | 'WARNING'
        | 'CRITICAL' = 'SUCCESS'

      if (rate < 40) status = 'CRITICAL'
      else if (rate < 80) status = 'WARNING'

      return {
        id: t.id,
        title: t.title,
        peopleCount: count,
        completionRate: rate,
        status,
      }
    })

    const timeline =
      await this.timeline.listGlobal()

    return {
      peopleStats,
      correctiveOpenCount,
      people: peopleView,
      tracks: tracksView,
      timeline,
    }
  }

  async getExecutiveMetrics(days = 30) {
    return this.metrics.getCorrectiveActionsSLA(days)
  }
}
