import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class TemporalRiskService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async calculateUrgency(personId: string) {
    const open = await this.prisma.assignment.count({
      where: {
        personId,
        progress: { lt: 100 },
      },
    })

    if (open === 0) return 'NORMAL'
    if (open <= 2) return 'WARNING'
    return 'CRITICAL'
  }
}
