import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import type { TemporalRiskLevel } from './temporal-risk.service'

@Injectable()
export class TemporalRiskRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getLastUrgency(
    personId: string,
  ): Promise<TemporalRiskLevel | null> {
    const last = await this.prisma.auditEvent.findFirst({
      where: {
        personId,
        action: 'TEMPORAL_RISK_ESCALATED',
      },
      orderBy: { createdAt: 'desc' },
    })

    if (!last || !last.metadata) return null

    const level = (last.metadata as any).level

    if (
      level === 'NORMAL' ||
      level === 'WARNING' ||
      level === 'CRITICAL'
    ) {
      return level
    }

    return null
  }
}
