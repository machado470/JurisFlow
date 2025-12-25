import { Injectable } from '@nestjs/common'
import { RiskService } from '../risk/risk.service'
import { PrismaService } from '../prisma/prisma.service'

type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

const RISK_PRIORITY: RiskLevel[] = [
  'CRITICAL',
  'HIGH',
  'MEDIUM',
  'LOW',
]

@Injectable()
export class ReportsService {
  constructor(
    private readonly risk: RiskService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * ============================
   * EXECUTIVE SUMMARY
   * ============================
   */

  async executiveSummary(orgId: string) {
    const people = await this.risk.listPeopleRisk(orgId)

    const summary: Record<RiskLevel | 'totalPeople', number> = {
      totalPeople: people.length,
      CRITICAL: 0,
      HIGH: 0,
      MEDIUM: 0,
      LOW: 0,
    }

    for (const p of people) {
      summary[p.risk as RiskLevel]++
    }

    return summary
  }

  /**
   * ============================
   * PEOPLE AT RISK (STRATEGIC)
   * ============================
   */

  async peopleAtRisk(orgId: string) {
    const people = await this.risk.listPeopleRisk(orgId)

    const risky = people.filter(p =>
      ['HIGH', 'CRITICAL'].includes(p.risk),
    )

    if (risky.length === 0) return []

    const personIds = risky.map(p => p.personId)

    const lastEvents =
      await this.prisma.event.findMany({
        where: { personId: { in: personIds } },
        orderBy: { createdAt: 'desc' },
      })

    return risky
      .map(p => {
        const event = lastEvents.find(
          e => e.personId === p.personId,
        )

        return {
          personId: p.personId,
          name: p.name,
          email: p.email,
          risk: p.risk,
          riskScore: p.riskScore,
          mainReason:
            event?.description ??
            'Risco educacional elevado',
          lastEventAt: event?.createdAt ?? null,
        }
      })
      .sort(
        (a, b) =>
          RISK_PRIORITY.indexOf(a.risk) -
          RISK_PRIORITY.indexOf(b.risk),
      )
  }

  /**
   * ============================
   * PENDING ACTIONS (OPERATIONAL)
   * ============================
   */

  async pending(orgId: string) {
    const peopleRisk = await this.risk.listPeopleRisk(orgId)

    const risky = peopleRisk.filter(p =>
      ['HIGH', 'CRITICAL'].includes(p.risk),
    )

    if (risky.length === 0) return []

    const personIds = risky.map(p => p.personId)

    const actions =
      await this.prisma.correctiveAction.findMany({
        where: {
          personId: { in: personIds },
          status: { not: 'DONE' },
        },
        include: {
          person: true,
        },
        orderBy: { createdAt: 'asc' },
      })

    return actions.map(a => ({
      personId: a.personId,
      personName: a.person.name,
      risk:
        risky.find(p => p.personId === a.personId)
          ?.risk,
      actionId: a.id,
      reason: a.reason,
      status: a.status,
      createdAt: a.createdAt,
    }))
  }
}
