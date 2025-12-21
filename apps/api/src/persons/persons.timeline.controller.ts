import { Controller, Get, Param } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Controller('persons')
export class PersonsTimelineController {
  constructor(private readonly prisma: PrismaService) {}

  @Get(':id/timeline')
  async timeline(@Param('id') id: string) {
    const [audits, events, assessments, actions] =
      await Promise.all([
        this.prisma.auditEvent.findMany({
          where: { personId: id },
        }),
        this.prisma.event.findMany({
          where: { personId: id },
        }),
        this.prisma.assessment.findMany({
          where: { personId: id },
        }),
        this.prisma.correctiveAction.findMany({
          where: { personId: id },
        }),
      ])

    const items = [
      ...audits.map(a => ({
        type: 'AUDIT',
        label: a.action,
        description: a.context,
        date: a.createdAt,
      })),
      ...events.map(e => ({
        type: 'EVENT',
        label: e.type,
        description: e.description,
        date: e.createdAt,
      })),
      ...assessments.map(a => ({
        type: 'ASSESSMENT',
        label: 'Avaliação concluída',
        description: `Score ${a.score} · Risco ${a.risk}`,
        date: a.createdAt,
      })),
      ...actions.map(a => ({
        type: 'CORRECTIVE_ACTION',
        label: `Ação ${a.status}`,
        description: a.reason,
        date: a.createdAt,
      })),
    ]

    return items.sort(
      (a, b) =>
        new Date(b.date).getTime() -
        new Date(a.date).getTime(),
    )
  }
}
