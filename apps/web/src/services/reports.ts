import api from './api'

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export type ExecutiveSummary = {
  totalPeople: number
  LOW: number
  MEDIUM: number
  HIGH: number
  CRITICAL: number
}

export type PersonAtRisk = {
  id: string
  name: string
  risk: RiskLevel
  riskScore: number
}

export type PersonAtRiskSoon = {
  id: string
  name: string
  daysInactive: number
}

export type RiskTrendPoint = {
  label: string
  critical: number
  high: number
  medium: number
}

export async function getExecutiveReport(): Promise<{
  summary: ExecutiveSummary
  peopleAtRisk: PersonAtRisk[]
  peopleAtRiskSoon: PersonAtRiskSoon[]
}> {
  const res = await api.get('/reports/executive')
  return res.data.data
}

export async function getRiskTrend(): Promise<RiskTrendPoint[]> {
  const res = await api.get('/reports/risk-trend')
  return res.data.data
}
