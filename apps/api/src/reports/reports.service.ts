import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { TemporalRiskService } from '../risk/temporal-risk.service'
import { TimelineService } from '../timeline/timeline.service'

type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

@Injectable()
export class ReportsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly temporal: TemporalRiskService,
    private readonly timeline: TimelineService,
  ) {}

  async getExecutiveReport(orgId: string) {
    const people = await this.prisma.person.findMany({
      where: { orgId, active: true },
      select: { id: true, name: true },
    })

    const assignments = await this.prisma.assignment.findMany({
      where: {
        person: { orgId },
      },
      include: {
        track: true,
      },
    })

    // 🔹 SUMMARY
    const totalAssignments = assignments.length
    const completedAssignments = assignments.filter(
      a => a.progress === 100,
    ).length

    const completionRate =
      totalAssignments === 0
        ? 0
        : Math.round(
            (completedAssignments / totalAssignments) * 100,
          )

    // 🔹 RISK BY LEVEL
    const riskByLevel: Record<RiskLevel, number> = {
      LOW: 0,
      MEDIUM: 0,
      HIGH: 0,
      CRITICAL: 0,
    }

    assignments.forEach(a => {
      riskByLevel[a.risk]++
    })

    // 🔹 PEOPLE AT RISK
    const peopleAtRisk = []

    for (const p of people) {
      const urgency = await this.temporal.calculateUrgency(
        p.id,
      )

      if (urgency !== 'NORMAL') {
        peopleAtRisk.push({
          id: p.id,
          name: p.name,
          risk: this.mapUrgencyToRisk(urgency),
          openAssignments: assignments.filter(
            a => a.personId === p.id && a.progress < 100,
          ).length,
        })
      }
    }

    // 🔹 TRACK AGGREGATION
    const tracksMap = new Map<string, any>()

    for (const a of assignments) {
      if (!tracksMap.has(a.trackId)) {
        tracksMap.set(a.trackId, {
          id: a.track.id,
          title: a.track.title,
          description: a.track.description,
          peopleCount: 0,
          assignmentsOpen: 0,
          completionRate: 0,
          risks: [] as RiskLevel[],
        })
      }

      const t = tracksMap.get(a.trackId)
      t.peopleCount++
      if (a.progress < 100) t.assignmentsOpen++
      t.risks.push(a.risk)
    }

    const tracks = Array.from(tracksMap.values()).map(t => {
      const completed =
        t.peopleCount - t.assignmentsOpen

      return {
        id: t.id,
        title: t.title,
        description: t.description,
        peopleCount: t.peopleCount,
        assignmentsOpen: t.assignmentsOpen,
        completionRate:
          t.peopleCount === 0
            ? 0
            : Math.round((completed / t.peopleCount) * 100),
        risk: this.maxRisk(t.risks),
      }
    })

    // 🔹 RECENT EVENTS (ORG)
    const recentEvents = await this.timeline.listByOrg(
      orgId,
    )

    return {
      summary: {
        peopleCount: people.length,
        totalAssignments,
        completedAssignments,
        completionRate,
        riskByLevel,
      },
      tracks,
      peopleAtRisk,
      recentEvents,
    }
  }

  private mapUrgencyToRisk(
    urgency: 'NORMAL' | 'WARNING' | 'CRITICAL',
  ): RiskLevel {
    if (urgency === 'CRITICAL') return 'CRITICAL'
    if (urgency === 'WARNING') return 'HIGH'
    return 'LOW'
  }

  private maxRisk(risks: RiskLevel[]): RiskLevel {
    if (risks.includes('CRITICAL')) return 'CRITICAL'
    if (risks.includes('HIGH')) return 'HIGH'
    if (risks.includes('MEDIUM')) return 'MEDIUM'
    return 'LOW'
  }
}
