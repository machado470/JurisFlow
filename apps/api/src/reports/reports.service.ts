import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

const DAYS_SOON_WARNING = 3

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async executive(orgId: string) {
    const people = await this.prisma.person.findMany({
      where: { orgId, active: true },
      include: { assignments: true },
    })

    const correctiveOpenCount =
      await this.prisma.correctiveAction.count({
        where: {
          person: { orgId },
          status: { in: ['OPEN', 'AWAITING_REASSESSMENT'] },
        },
      })

    const peopleAtRisk: any[] = []
    const peopleAtRiskSoon: any[] = []

    const now = Date.now()

    for (const p of people) {
      const hasCritical =
        await this.prisma.correctiveAction.count({
          where: {
            personId: p.id,
            status: 'OPEN',
          },
        })

      if (hasCritical) {
        peopleAtRisk.push({
          id: p.id,
          name: p.name,
        })
        continue
      }

      for (const a of p.assignments) {
        if (a.progress >= 100) continue

        const daysInactive = Math.floor(
          (now - a.updatedAt.getTime()) /
            (1000 * 60 * 60 * 24),
        )

        if (daysInactive >= DAYS_SOON_WARNING) {
          peopleAtRiskSoon.push({
            id: p.id,
            name: p.name,
            daysInactive,
          })
          break
        }
      }
    }

    return {
      peopleAtRisk,
      peopleAtRiskSoon,
      correctiveOpenCount,
    }
  }
}
