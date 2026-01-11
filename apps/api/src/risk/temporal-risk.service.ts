import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { PersonSuspensionService } from './person-suspension.service'
import { TimelineService } from '../timeline/timeline.service'
import { TemporalRiskRepository } from './temporal-risk.repository'

export type TemporalRiskLevel =
  | 'NORMAL'
  | 'WARNING'
  | 'CRITICAL'

export type TemporalRiskResult = {
  level: TemporalRiskLevel
  daysOpen: number
  remainingDays?: number
  limitDays?: number
  recommendedAction?: string
}

@Injectable()
export class TemporalRiskService {
  private readonly WARNING_DAYS = 7
  private readonly CRITICAL_DAYS = 14

  constructor(
    private readonly prisma: PrismaService,
    private readonly suspension: PersonSuspensionService,
    private readonly timeline: TimelineService,
    private readonly repo: TemporalRiskRepository,
  ) {}

  async calculateUrgency(
    personId: string,
  ): Promise<TemporalRiskResult> {
    // 1️⃣ Suspensão anula risco temporal
    const isSuspended =
      await this.suspension.isSuspended(personId)

    if (isSuspended) {
      return {
        level: 'NORMAL',
        daysOpen: 0,
      }
    }

    // 2️⃣ Assignments abertos
    const assignments =
      await this.prisma.assignment.findMany({
        where: {
          personId,
          progress: { lt: 100 },
        },
        select: {
          createdAt: true,
        },
      })

    if (assignments.length === 0) {
      return {
        level: 'NORMAL',
        daysOpen: 0,
      }
    }

    const now = Date.now()
    let maxDaysOpen = 0
    let level: TemporalRiskLevel = 'NORMAL'

    for (const a of assignments) {
      const daysOpen =
        (now - a.createdAt.getTime()) /
        (1000 * 60 * 60 * 24)

      maxDaysOpen = Math.max(maxDaysOpen, daysOpen)

      if (daysOpen >= this.CRITICAL_DAYS) {
        level = 'CRITICAL'
        break
      }

      if (daysOpen >= this.WARNING_DAYS) {
        level = 'WARNING'
      }
    }

    const days = Math.floor(maxDaysOpen)

    // 3️⃣ Logar mudança real (anti-spam)
    const last =
      await this.repo.getLastUrgency(personId)

    if (level !== 'NORMAL' && level !== last) {
      await this.timeline.log({
        action: 'TEMPORAL_RISK_ESCALATED',
        personId,
        description:
          level === 'CRITICAL'
            ? 'Risco crítico por inatividade prolongada'
            : 'Risco elevado por atraso em atividades',
        metadata: {
          level,
          daysOpen: days,
          limitDays:
            level === 'CRITICAL'
              ? this.CRITICAL_DAYS
              : this.WARNING_DAYS,
          remainingDays:
            level === 'CRITICAL'
              ? 0
              : Math.max(
                  0,
                  this.CRITICAL_DAYS - days,
                ),
          recommendedAction:
            'Concluir atividades pendentes para evitar bloqueio operacional',
        },
      })
    }

    return {
      level,
      daysOpen: days,
      limitDays:
        level === 'NORMAL'
          ? undefined
          : level === 'CRITICAL'
          ? this.CRITICAL_DAYS
          : this.WARNING_DAYS,
      remainingDays:
        level === 'CRITICAL'
          ? 0
          : level === 'WARNING'
          ? Math.max(
              0,
              this.CRITICAL_DAYS - days,
            )
          : undefined,
      recommendedAction:
        level === 'NORMAL'
          ? undefined
          : 'Concluir atividades pendentes para evitar bloqueio operacional',
    }
  }
}
