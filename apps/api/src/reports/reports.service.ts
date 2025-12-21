import { Injectable } from '@nestjs/common'
import { RiskService } from '../risk/risk.service'
import { PrismaService } from '../prisma/prisma.service'
import { RiskLevel } from '@prisma/client'

@Injectable()
export class ReportsService {
  constructor(
    private readonly risk: RiskService,
    private readonly prisma: PrismaService,
  ) {}

  async executiveSummary(orgId: string) {
    let people: any[] = []

    try {
      people = await this.risk.listPeopleRisk(orgId)
    } catch (err) {
      console.error('[REPORTS] Erro em listPeopleRisk:', err)
      return {
        totalPeople: 0,
        CRITICAL: 0,
        HIGH: 0,
        MEDIUM: 0,
        LOW: 0,
      }
    }

    const summary = {
      totalPeople: people.length,
      CRITICAL: 0,
      HIGH: 0,
      MEDIUM: 0,
      LOW: 0,
    }

    for (const p of people) {
      const risk =
        p?.risk && RiskLevel[p.risk as RiskLevel]
          ? p.risk
          : RiskLevel.LOW

      summary[risk]++
    }

    return summary
  }

  async peopleAtRisk(orgId: string) {
    let people: any[] = []

    try {
      people = await this.risk.listPeopleRisk(orgId)
    } catch (err) {
      console.error('[REPORTS] Erro em listPeopleRisk:', err)
      return []
    }

    const order = [
      RiskLevel.CRITICAL,
      RiskLevel.HIGH,
      RiskLevel.MEDIUM,
      RiskLevel.LOW,
    ]

    return people.sort((a, b) => {
      const aRisk = a?.risk ?? RiskLevel.LOW
      const bRisk = b?.risk ?? RiskLevel.LOW
      return order.indexOf(aRisk) - order.indexOf(bRisk)
    })
  }

  async trackCompliance(orgId: string) {
    const assignments = await this.prisma.assignment.findMany({
      where: {
        person: { orgId },
      },
      include: {
        track: true,
      },
    })

    const byTrack = new Map<
      string,
      { trackId: string; title: string; total: number; sum: number }
    >()

    for (const a of assignments) {
      const current = byTrack.get(a.trackId)

      if (!current) {
        byTrack.set(a.trackId, {
          trackId: a.trackId,
          title: a.track.title,
          total: 1,
          sum: a.progress,
        })
      } else {
        current.total += 1
        current.sum += a.progress
      }
    }

    return Array.from(byTrack.values()).map(t => ({
      trackId: t.trackId,
      title: t.title,
      compliance: Math.round(t.sum / t.total),
    }))
  }
}
