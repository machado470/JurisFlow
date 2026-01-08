import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { TemporalRiskService } from '../risk/temporal-risk.service'
import { ExecutiveMetricsService } from './executive-metrics.service'
import { TimelineService } from '../timeline/timeline.service'

type ExecStatus = 'OK' | 'WARNING' | 'CRITICAL'
type TrackStatus = 'SUCCESS' | 'WARNING' | 'CRITICAL'

@Injectable()
export class ReportsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly temporalRisk: TemporalRiskService,
    private readonly metrics: ExecutiveMetricsService,
    private readonly timeline: TimelineService,
  ) {}

  async getExecutiveReport() {
    const people = await this.prisma.person.findMany({
      include: { assignments: true },
    })

    const peopleStats: Record<ExecStatus, number> = {
      OK: 0,
      WARNING: 0,
      CRITICAL: 0,
    }

    const peopleView = []

    for (const p of people) {
      let urgency: ExecStatus = 'OK'

      try {
        const u = await this.temporalRisk.calculateUrgency(p.id)
        if (u === 'CRITICAL') urgency = 'CRITICAL'
        else if (u === 'WARNING') urgency = 'WARNING'
      } catch {}

      peopleStats[urgency]++

      peopleView.push({
        id: p.id,
        name: p.name,
        status: urgency,
      })
    }

    const correctiveOpenCount =
      await this.prisma.correctiveAction.count({
        where: { status: 'OPEN' },
      })

    const tracks = await this.prisma.track.findMany({
      include: { assignments: true },
      orderBy: { createdAt: 'desc' },
    })

    const tracksView = tracks.map(t => {
      const peopleCount = t.assignments.length
      const completionRate =
        peopleCount === 0
          ? 0
          : Math.round(
              t.assignments.reduce(
                (s, a) => s + a.progress,
                0,
              ) / peopleCount,
            )

      let status: TrackStatus = 'SUCCESS'
      if (completionRate < 40) status = 'CRITICAL'
      else if (completionRate < 80) status = 'WARNING'

      return {
        id: t.id,
        title: t.title,
        peopleCount,
        completionRate,
        status,
      }
    })

    const timeline = await this.timeline.listGlobal()

    return {
      peopleStats,
      correctiveOpenCount,
      people: peopleView,
      tracks: tracksView,
      timeline,
    }
  }

  async getExecutiveMetrics(days = 30) {
    const correctiveSLA =
      await this.metrics.getCorrectiveActionsSLA(days)

    return { correctiveSLA }
  }
}
