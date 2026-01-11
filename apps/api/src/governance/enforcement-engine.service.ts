import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { TimelineService } from '../timeline/timeline.service'
import { AuditService } from '../audit/audit.service'
import { OperationalStateService } from '../people/operational-state.service'
import { EnforcementPolicyService } from './enforcement-policy.service'

@Injectable()
export class EnforcementEngineService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly timeline: TimelineService,
    private readonly audit: AuditService,
    private readonly operationalState: OperationalStateService,
    private readonly policy: EnforcementPolicyService,
  ) {}

  async runForAllActivePeople() {
    const persons = await this.prisma.person.findMany({
      where: { active: true },
      select: { id: true },
    })

    let created = 0
    let warnings = 0

    for (const p of persons) {
      const r = await this.runForPerson(p.id)
      if (r.createdCorrective) created++
      if (r.raisedWarning) warnings++
    }

    return {
      success: true,
      peopleProcessed: persons.length,
      createdCorrectives: created,
      warningsRaised: warnings,
    }
  }

  async runForPerson(personId: string) {
    const status = await this.operationalState.getStatus(personId)

    // Exceção ativa agora?
    const hasActiveException = await this.hasActiveException(personId)

    const decision = this.policy.decide({
      status,
      hasActiveException,
    })

    if (decision.action === 'RAISE_WARNING') {
      // idempotência por transição já é cuidada pelo OperationalStateService (state change log)
      // aqui a gente só registra um evento "produto" se quiser (anti-spam pela última ação)
      const already = await this.prisma.auditEvent.findFirst({
        where: {
          personId,
          action: 'OPERATIONAL_WARNING_RAISED',
        },
        orderBy: { createdAt: 'desc' },
      })

      // evita flood: se já teve nos últimos 24h, não repete
      if (!already || Date.now() - already.createdAt.getTime() > 24 * 3600 * 1000) {
        await this.timeline.log({
          action: 'OPERATIONAL_WARNING_RAISED',
          personId,
          description: decision.reason,
          metadata: status.metadata ?? {},
        })
      }

      return { createdCorrective: false, raisedWarning: true }
    }

    if (decision.action === 'CREATE_CORRECTIVE_ACTION') {
      const exists = await this.prisma.correctiveAction.findFirst({
        where: {
          personId,
          status: 'OPEN',
          reason: decision.reason,
        },
      })

      if (!exists) {
        await this.prisma.correctiveAction.create({
          data: {
            personId,
            reason: decision.reason,
            status: 'OPEN',
          },
        })

        await this.timeline.log({
          action: 'CORRECTIVE_ACTION_CREATED',
          personId,
          description: 'Criada automaticamente por risco temporal crítico',
          metadata: { source: 'ENFORCEMENT_ENGINE' },
        })

        await this.audit.log({
          personId,
          action: 'AUTO_CORRECTIVE_ACTION_CREATED',
          context: decision.reason,
        })

        return { createdCorrective: true, raisedWarning: false }
      }
    }

    return { createdCorrective: false, raisedWarning: false }
  }

  private async hasActiveException(personId: string) {
    const now = new Date()

    const active = await this.prisma.personException.findFirst({
      where: {
        personId,
        startsAt: { lte: now },
        endsAt: { gte: now },
      },
      select: { id: true },
    })

    return !!active
  }
}
