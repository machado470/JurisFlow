import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { PersonSuspensionService } from './person-suspension.service'

type UrgencyLevel = 'NORMAL' | 'WARNING' | 'CRITICAL'

@Injectable()
export class TemporalRiskService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly suspension: PersonSuspensionService,
  ) {}

  async calculateUrgency(personId: string): Promise<UrgencyLevel> {
    // 1️⃣ Pessoa suspensa nunca gera urgência
    const isSuspended =
      await this.suspension.isSuspended(personId)

    if (isSuspended) {
      return 'NORMAL'
    }

    // 2️⃣ Contar pendências reais
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
