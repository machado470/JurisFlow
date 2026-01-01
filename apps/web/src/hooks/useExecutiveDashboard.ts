import { useEffect, useMemo, useState } from 'react'
import api from '../services/api'

type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

type ExecutiveSummary = Record<RiskLevel | 'totalPeople', number>

type PersonAtRisk = {
  id: string
  name: string
  risk?: RiskLevel
  daysInactive?: number
}

type ExecutiveResponse = {
  summary: ExecutiveSummary
  peopleAtRisk: PersonAtRisk[]
  peopleAtRiskSoon: PersonAtRisk[]
  nextAdminAction:
    | 'REVIEW_CRITICAL_PEOPLE'
    | 'CHECK_INACTIVE_ASSIGNMENTS'
    | 'HANDLE_CORRECTIVE_REGIME'
    | 'SYSTEM_STABLE'
  hasCorrectiveRegime: boolean
  correctiveOpenCount: number
}

type TrendItem = {
  label: string
  critical: number
  high: number
  medium: number
}

function labelAdminAction(action: ExecutiveResponse['nextAdminAction']) {
  if (action === 'HANDLE_CORRECTIVE_REGIME') {
    return {
      code: action,
      label: 'Tratar regime corretivo organizacional',
      hint: 'Existem ações corretivas abertas ou reavaliações pendentes.',
    }
  }

  if (action === 'REVIEW_CRITICAL_PEOPLE') {
    return {
      code: action,
      label: 'Revisar pessoas em risco alto/crítico',
      hint: 'Atue nos casos críticos e evite escalada.',
    }
  }

  if (action === 'CHECK_INACTIVE_ASSIGNMENTS') {
    return {
      code: action,
      label: 'Verificar inatividade em trilhas',
      hint: 'Há sinais de risco em formação por inércia.',
    }
  }

  return {
    code: action,
    label: 'Sistema estável',
    hint: 'Manter monitoramento contínuo.',
  }
}

export function useExecutiveDashboard() {
  const [loading, setLoading] = useState(true)

  const [summary, setSummary] = useState<ExecutiveSummary | null>(null)
  const [peopleAtRisk, setPeopleAtRisk] = useState<PersonAtRisk[]>([])
  const [peopleAtRiskSoon, setPeopleAtRiskSoon] = useState<PersonAtRisk[]>([])
  const [trend, setTrend] = useState<TrendItem[]>([])
  const [nextAdminAction, setNextAdminAction] = useState<ReturnType<
    typeof labelAdminAction
  > | null>(null)

  const [hasCorrectiveRegime, setHasCorrectiveRegime] = useState(false)
  const [correctiveOpenCount, setCorrectiveOpenCount] = useState(0)

  async function load() {
    setLoading(true)

    const [execRes, trendRes] = await Promise.all([
      api.get('/reports/executive'),
      api.get('/reports/risk-trend'),
    ])

    const exec: ExecutiveResponse = execRes.data?.data ?? execRes.data

    setSummary(exec.summary ?? null)
    setPeopleAtRisk(exec.peopleAtRisk ?? [])
    setPeopleAtRiskSoon(exec.peopleAtRiskSoon ?? [])
    setHasCorrectiveRegime(Boolean(exec.hasCorrectiveRegime))
    setCorrectiveOpenCount(exec.correctiveOpenCount ?? 0)
    setNextAdminAction(labelAdminAction(exec.nextAdminAction))
    setTrend(trendRes.data?.data ?? trendRes.data ?? [])

    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  return useMemo(
    () => ({
      loading,
      summary,
      peopleAtRisk,
      peopleAtRiskSoon,
      trend,
      nextAdminAction,
      hasCorrectiveRegime,
      correctiveOpenCount,
      reload: load,
    }),
    [
      loading,
      summary,
      peopleAtRisk,
      peopleAtRiskSoon,
      trend,
      nextAdminAction,
      hasCorrectiveRegime,
      correctiveOpenCount,
    ],
  )
}
