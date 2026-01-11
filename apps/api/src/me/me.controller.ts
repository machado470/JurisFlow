import {
  Controller,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { AssignmentsService } from '../assignments/assignments.service'
import {
  OperationalStateService,
  OperationalStatus,
} from '../people/operational-state.service'
import { PrismaService } from '../prisma/prisma.service'

type OperationalView = {
  state: string
  severity: 'success' | 'warning' | 'danger'
  message: string
  cta?: string
  metadata?: Record<string, any>
}

@Controller('me')
@UseGuards(JwtAuthGuard)
export class MeController {
  constructor(
    private readonly assignments: AssignmentsService,
    private readonly operationalState: OperationalStateService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  async me(@Req() req: any) {
    const { sub, role, orgId, personId } = req.user

    // ----------------------------
    // 🧠 ESTADO OPERACIONAL (BRUTO)
    // ----------------------------
    let operational: OperationalStatus = {
      state: 'NORMAL',
    }

    if (personId) {
      operational =
        await this.operationalState.getStatus(
          personId,
        )
    }

    // ----------------------------
    // 🎯 TRADUÇÃO PARA PRODUTO
    // ----------------------------
    const operationalView =
      this.translateOperationalState(operational)

    // ----------------------------
    // 🏢 ORGANIZAÇÃO
    // ----------------------------
    const org = await this.prisma.organization.findUnique({
      where: { id: orgId },
      select: { requiresOnboarding: true },
    })

    // ----------------------------
    // 📚 ASSIGNMENTS ATIVOS
    // ----------------------------
    const rawAssignments = personId
      ? await this.assignments.listOpenByPerson(
          personId,
        )
      : []

    const assignments = rawAssignments.map(a => {
      let status:
        | 'NOT_STARTED'
        | 'IN_PROGRESS'
        | 'COMPLETED' = 'NOT_STARTED'

      if (a.progress > 0 && a.progress < 100) {
        status = 'IN_PROGRESS'
      }

      if (a.progress === 100) {
        status = 'COMPLETED'
      }

      return {
        id: a.id,
        progress: a.progress,
        status,
        track: {
          id: a.track.id,
          title: a.track.title,
        },
      }
    })

    // ----------------------------
    // 📦 RESPOSTA FINAL
    // ----------------------------
    return {
      user: {
        id: sub,
        role,
        orgId,
        personId,
      },

      operational: operationalView,
      assignments,

      requiresOnboarding:
        org?.requiresOnboarding ?? false,
    }
  }

  // ======================================================
  // 🔁 TRADUTOR DE ESTADO OPERACIONAL → UX
  // ======================================================
  private translateOperationalState(
    operational: OperationalStatus,
  ): OperationalView {
    const meta = operational.metadata ?? {}

    switch (operational.state) {
      case 'WARNING':
        return {
          state: 'WARNING',
          severity: 'warning',
          message: `Atenção: você tem ${
            meta.remainingDays ?? 'alguns'
          } dias para evitar bloqueio operacional.`,
          cta:
            meta.recommendedAction ??
            'Concluir atividades pendentes',
          metadata: meta,
        }

      case 'RESTRICTED':
        return {
          state: 'RESTRICTED',
          severity: 'danger',
          message:
            operational.reason ??
            'Seu acesso está temporariamente bloqueado.',
          cta: 'Regularizar pendências',
          metadata: meta,
        }

      case 'SUSPENDED':
        return {
          state: 'SUSPENDED',
          severity: 'danger',
          message:
            operational.reason ??
            'Usuário suspenso temporariamente.',
          metadata: meta,
        }

      default:
        return {
          state: 'NORMAL',
          severity: 'success',
          message:
            'Tudo certo. Nenhuma ação necessária.',
        }
    }
  }
}
