import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { OperationalStateService } from './operational-state.service'
import { TimelineService } from '../timeline/timeline.service'

@Injectable()
export class OperationalStateJob {
  constructor(
    private readonly prisma: PrismaService,
    private readonly operationalState: OperationalStateService,
    private readonly timeline: TimelineService,
  ) {}

  async run() {
    const persons = await this.prisma.person.findMany({
      where: { active: true },
      select: { id: true },
    })

    for (const p of persons) {
      const status = await this.operationalState.getStatus(p.id)

      // Se travou por risco temporal: criar corretiva institucional (idempotente)
      const trigger = status?.metadata?.trigger
      const level = status?.metadata?.level

      const shouldCreate =
        status.state === 'RESTRICTED' &&
        trigger === 'TEMPORAL_RISK' &&
        level === 'CRITICAL'

      if (shouldCreate) {
        const exists = await this.prisma.correctiveAction.findFirst({
          where: {
            personId: p.id,
            status: 'OPEN',
            reason: 'Ação corretiva automática por risco temporal crítico',
          },
        })

        if (!exists) {
          await this.prisma.correctiveAction.create({
            data: {
              personId: p.id,
              reason: 'Ação corretiva automática por risco temporal crítico',
              status: 'OPEN',
            },
          })

          await this.timeline.log({
            action: 'CORRECTIVE_ACTION_CREATED',
            personId: p.id,
            description: 'Criada automaticamente por risco temporal crítico',
            metadata: { source: 'OPERATIONAL_STATE_JOB' },
          })
        }
      }
    }
  }
}
