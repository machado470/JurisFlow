import {
  Controller,
  Get,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { RiskSnapshotService } from '../risk/risk-snapshot.service'

type TimelineItem = {
  type: 'AUDIT' | 'SYSTEM' | 'RISK'
  title: string
  description?: string
  impact?: string
  tone: 'info' | 'warning' | 'critical' | 'success'
  createdAt: Date
}

@Controller('persons')
@UseGuards(JwtAuthGuard)
export class PersonsTimelineController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly snapshots: RiskSnapshotService,
  ) {}

  @Get(':id/timeline')
  async timeline(
    @Req() req: any,
    @Param('id') personId: string,
  ) {
    const orgId = req.user.orgId

    const person = await this.prisma.person.findFirst({
      where: { id: personId, orgId },
    })

    if (!person) return []

    const auditEvents =
      await this.prisma.auditEvent.findMany({
        where: { personId },
      })

    const systemEvents =
      await this.prisma.event.findMany({
        where: { personId },
      })

    const riskSnapshots =
      await this.snapshots.listByPerson(personId)

    const auditTimeline: TimelineItem[] =
      auditEvents.map(e => ({
        type: 'AUDIT',
        title: this.humanizeAuditAction(e.action),
        description: e.context ?? undefined,
        tone: 'info',
        createdAt: e.createdAt,
      }))

    const systemTimeline: TimelineItem[] =
      systemEvents.map(e => ({
        type: 'SYSTEM',
        title: this.humanizeSystemEvent(e.type),
        description:
          e.description ??
          'Evento registrado automaticamente pelo sistema.',
        tone: this.toneFromSystemEvent(e.type),
        createdAt: e.createdAt,
      }))

    const riskTimeline: TimelineItem[] =
      riskSnapshots.map(s => ({
        type: 'RISK',
        title:
          s.score > 0
            ? 'Risco aumentado'
            : 'Risco reduzido',
        description: s.reason,
        impact:
          s.score > 0
            ? `+${s.score} pontos de risco`
            : `${s.score} pontos de risco`,
        tone: s.score > 0 ? 'warning' : 'success',
        createdAt: s.createdAt,
      }))

    return [
      ...auditTimeline,
      ...systemTimeline,
      ...riskTimeline,
    ].sort(
      (a, b) =>
        b.createdAt.getTime() -
        a.createdAt.getTime(),
    )
  }

  // ----------------------------
  // HUMANIZAÇÃO
  // ----------------------------

  private humanizeAuditAction(action: string) {
    const map: Record<string, string> = {
      ASSIGNMENT_CREATED: 'Trilha atribuída',
      ASSIGNMENT_UPDATED: 'Progresso atualizado',
      ASSESSMENT_SUBMITTED:
        'Avaliação concluída',
    }

    return map[action] ?? action
  }

  private humanizeSystemEvent(type: string) {
    const map: Record<string, string> = {
      PERSON_DEACTIVATED: 'Pessoa desativada',
      PERSON_REACTIVATED: 'Pessoa reativada',
      CORRECTIVE_ACTION_CREATED:
        'Ação corretiva criada',
      CORRECTIVE_ACTION_RESOLVED:
        'Ação corretiva resolvida',
      ASSIGNMENT_INERTIA:
        'Inatividade prolongada detectada',
      CORRECTIVE_ACTION_OVERDUE:
        'Ação corretiva em atraso',
      MANUAL_REMINDER_SENT:
        'Lembrete manual enviado pelo administrador',
    }

    return map[type] ?? 'Evento do sistema'
  }

  private toneFromSystemEvent(
    type: string,
  ): TimelineItem['tone'] {
    if (
      type === 'CORRECTIVE_ACTION_OVERDUE' ||
      type === 'ASSIGNMENT_INERTIA'
    )
      return 'critical'

    if (type === 'CORRECTIVE_ACTION_CREATED')
      return 'warning'

    if (type === 'CORRECTIVE_ACTION_RESOLVED')
      return 'success'

    if (type === 'MANUAL_REMINDER_SENT')
      return 'info'

    return 'info'
  }
}
