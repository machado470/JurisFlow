import { Injectable } from '@nestjs/common'
import type { OperationalStatus } from '../people/operational-state.service'

export type EnforcementDecision =
  | {
      action: 'NONE'
      reason?: string
    }
  | {
      action: 'CREATE_CORRECTIVE_ACTION'
      reason: string
    }
  | {
      action: 'RAISE_WARNING'
      reason: string
    }

@Injectable()
export class EnforcementPolicyService {
  decide(params: {
    status: OperationalStatus
    hasActiveException: boolean
  }): EnforcementDecision {
    const { status, hasActiveException } = params
    const meta = status.metadata ?? {}

    // Exceção ativa: não punir por risco temporal automático
    if (hasActiveException) {
      return {
        action: 'NONE',
        reason: 'Exceção ativa: enforcement automático suspenso para risco temporal',
      }
    }

    // WARNING → só alerta (sem bloqueio e sem corretiva automática)
    if (status.state === 'WARNING') {
      return {
        action: 'RAISE_WARNING',
        reason: 'Alerta operacional por risco temporal (WARNING)',
      }
    }

    // RESTRICTED por temporal CRITICAL → criar corretiva automática
    if (
      status.state === 'RESTRICTED' &&
      meta.trigger === 'TEMPORAL_RISK' &&
      meta.level === 'CRITICAL'
    ) {
      return {
        action: 'CREATE_CORRECTIVE_ACTION',
        reason: 'Ação corretiva automática por risco temporal crítico',
      }
    }

    return { action: 'NONE' }
  }
}
