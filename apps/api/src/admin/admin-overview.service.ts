import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

@Injectable()
export class AdminOverviewService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview(orgId: string) {
    const assignments = await this.prisma.assignment.findMany({
      where: { person: { orgId } },
      include: { person: true },
    })

    const summary: Record<RiskLevel | 'total', number> = {
      total: assignments.length,
      CRITICAL: 0,
      HIGH: 0,
      MEDIUM: 0,
      LOW: 0,
    }

    for (const a of assignments) {
      const risk = a.risk as RiskLevel
      summary[risk]++
    }

    return summary
  }
}
