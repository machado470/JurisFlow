import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { AuditService } from '../audit/audit.service'
import { RiskService } from '../risk/risk.service'
import {
  OperationalStateService,
  OperationalState,
} from '../people/operational-state.service'

@Injectable()
export class CorrectiveActionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly risk: RiskService,
    private readonly operationalState: OperationalStateService,
  ) {}

  // ----------------------------
  // 📋 LISTAGEM
  // ----------------------------
  async listByPerson(personId: string) {
    return this.prisma.correctiveAction.findMany({
      where: { personId },
      orderBy: { createdAt: 'desc' },
    })
  }

  // ----------------------------
  // ✅ RESOLUÇÃO MANUAL (COM ESTADO OPERACIONAL)
  // ----------------------------
  async resolve(actionId: string) {
    const action =
      await this.prisma.correctiveAction.findUnique({
        where: { id: actionId },
      })

    if (!action) {
      throw new NotFoundException(
        'Ação corretiva não encontrada',
      )
    }

    if (action.status !== 'OPEN') {
      throw new BadRequestException(
        'Ação não está aberta',
      )
    }

    const state: OperationalState =
      await this.operationalState.getState(
        action.personId,
      )

    if (state !== 'NORMAL') {
      throw new ForbiddenException(
        `Ação bloqueada. Estado operacional atual: ${state}`,
      )
    }

    await this.prisma.correctiveAction.update({
      where: { id: actionId },
      data: {
        status: 'AWAITING_REASSESSMENT',
        resolvedAt: new Date(),
      },
    })

    await this.audit.log({
      action: 'CORRECTIVE_ACTION_RESOLVED',
      personId: action.personId,
      context:
        'Ação resolvida manualmente. Reavaliação pendente.',
    })

    return { success: true }
  }

  // ----------------------------
  // 🔁 REAVALIAÇÃO AUTOMÁTICA (COM ESTADO OPERACIONAL)
  // ----------------------------
  async processReassessment(personId: string) {
    const state: OperationalState =
      await this.operationalState.getState(personId)

    if (state !== 'NORMAL') {
      throw new ForbiddenException(
        `Reavaliação bloqueada. Estado operacional atual: ${state}`,
      )
    }

    // Recalcula risco com base em eventos
    const score =
      await this.risk.recalculatePersonRisk(personId)

    // Regra MV1:
    // score < 70 → regime encerrado
    // score >= 70 → regime reaberto
    if (score < 70) {
      await this.prisma.correctiveAction.updateMany({
        where: {
          personId,
          status: 'AWAITING_REASSESSMENT',
        },
        data: {
          status: 'DONE',
        },
      })

      await this.audit.log({
        action: 'CORRECTIVE_REGIME_CLOSED',
        personId,
        context:
          'Reavaliação bem-sucedida. Risco normalizado.',
      })

      return {
        closed: true,
        score,
      }
    }

    await this.prisma.correctiveAction.updateMany({
      where: {
        personId,
        status: 'AWAITING_REASSESSMENT',
      },
      data: {
        status: 'OPEN',
      },
    })

    await this.audit.log({
      action: 'CORRECTIVE_REGIME_REOPENED',
      personId,
      context:
        'Reavaliação falhou. Risco ainda elevado.',
    })

    return {
      closed: false,
      score,
    }
  }
}
