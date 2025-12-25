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

type TimelineItem =
  | {
      type: 'AUDIT'
      title: string
      description?: string
      createdAt: Date
    }
  | {
      type: 'SYSTEM'
      title: string
      description?: string
      createdAt: Date
    }
  | {
      type: 'RISK'
      title: string
      description: string
      score: number
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

    // valida pessoa
    const person = await this.prisma.person.findFirst({
      where: { id: personId, orgId },
    })

    if (!person) {
      return []
    }

    // 1) ações humanas
    const auditEvents =
      await this.prisma.auditEvent.findMany({
        where: { personId },
      })

    // 2) eventos sistêmicos
    const systemEvents =
      await this.prisma.event.findMany({
        where: { personId },
      })

    // 3) snapshots de risco
    const riskSnapshots =
      await this.snapshots.listByPerson(personId)

    const auditTimeline: TimelineItem[] =
      auditEvents.map(e => ({
        type: 'AUDIT',
        title: this.humanizeAuditAction(e.action),
        description: e.context ?? undefined,
        createdAt: e.createdAt,
      }))

    const systemTimeline: TimelineItem[] =
      systemEvents.map(e => ({
        type: 'SYSTEM',
        title: this.humanizeSystemEvent(e.type),
        description: e.description ?? undefined,
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
        score: s.score,
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

  private humanizeAuditAction(action: string) {
    const map: Record<string, string> = {
      ASSIGNMENT_CREATED: 'Trilha atribuída',
      ASSIGNMENT_UPDATED: 'Progresso atualizado',
      ASSESSMENT_SUBMITTED: 'Avaliação concluída',
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
    }

    return map[type] ?? type
  }
}
