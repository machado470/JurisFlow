import api from './api'

export type RiskLevel = 'LOW' | 'HIGH' | 'CRITICAL'

export type PersonAtRisk = {
  id: string
  name: string
  risk: RiskLevel
}

export type ExecutiveReport = {
  peopleAtRisk: PersonAtRisk[]
  peopleAtRiskSoon: PersonAtRisk[]
  correctiveOpenCount: number
}

type ApiEnvelope<T> = {
  success: boolean
  data: T
}

/**
 * Suporta 2 formatos:
 * 1) Envelope: { success: true, data: {...} }
 * 2) Direto:   { ... }
 */
export async function getExecutiveReport(): Promise<ExecutiveReport> {
  const res = await api.get('/reports/executive')
  const payload = res.data as any

  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as ApiEnvelope<ExecutiveReport>).data
  }

  return payload as ExecutiveReport
}
