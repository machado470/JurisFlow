import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

export type TimelineSource = 'AUDIT' | 'EVENT' | 'RISK'
export type TimelineSeverity =
  | 'INFO'
  | 'WARNING'
  | 'CRITICAL'
  | 'SUCCESS'

export type TimelineItem = {
  id: string
  source: TimelineSource
  title: string
  description: string
  impact?: string | null
  severity: TimelineSeverity
  createdAt: string
  personName?: string
}

@Injectable()
export class TimelineService {
  constructor(private readonly prisma: PrismaService) {}

  async buildForPerson(
    personId: string,
  ): Promise<TimelineItem[]> {
    const [events, snapshots, audits, person] =
      await Promise.all([
        this.prisma.event.findMany({
          where: { personId },
        }),
        this.prisma.riskSnapshot.findMany({
          where: { personId },
        }),
        this.prisma.auditEvent.findMany({
          where: { personId },
        }),
        this.prisma.person.findUnique({
          where: { id: personId },
          select: { name: true },
        }),
      ])

    const personName = person?.name

    const timeline: TimelineItem[] = []

    // EVENT — comportamento do sistema
    for (const e of events) {
      timeline.push({
        id: e.id,
        source: 'EVENT',
        title: this.titleFromEvent(e.type),
        description:
          e.description ??
          'Evento registrado automaticamente.',
        severity: this.severityFromEvent(e.type),
        createdAt: e.createdAt.toISOString(),
        personName,
      })
    }

    // RISK — impacto mensurável
    for (const r of snapshots) {
      timeline.push({
        id: r.id,
        source: 'RISK',
        title:
          r.score > 0
            ? 'Impacto negativo no risco'
            : 'Recuperação de risco',
        description: r.reason,
        impact:
          r.score > 0
            ? `+${r.score} pontos de risco`
            : `${r.score} pontos de risco`,
        severity:
          r.score > 0 ? 'WARNING' : 'SUCCESS',
        createdAt: r.createdAt.toISOString(),
        personName,
      })
    }

    // AUDIT — decisão humana
    for (const a of audits) {
      timeline.push({
        id: a.id,
        source: 'AUDIT',
        title: 'Ação administrativa',
        description:
          a.context ?? 'Ação registrada pelo sistema.',
        severity: 'INFO',
        createdAt: a.createdAt.toISOString(),
        personName,
      })
    }

    return timeline.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() -
        new Date(b.createdAt).getTime(),
    )
  }

  private titleFromEvent(type: string) {
    switch (type) {
      case 'ASSIGNMENT_INERTIA':
        return 'Inatividade detectada'
      case 'CORRECTIVE_ACTION_OVERDUE':
        return 'Ação corretiva em atraso'
      case 'PERSON_EXCEPTION_ACTIVE':
        return 'Exceção humana ativa'
      default:
        return 'Evento do sistema'
    }
  }

  private severityFromEvent(
    type: string,
  ): TimelineSeverity {
    switch (type) {
      case 'CORRECTIVE_ACTION_OVERDUE':
        return 'CRITICAL'
      case 'ASSIGNMENT_INERTIA':
        return 'WARNING'
      default:
        return 'INFO'
    }
  }
}
