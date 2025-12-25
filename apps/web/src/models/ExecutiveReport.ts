export type RiskLevel =
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'CRITICAL'

export type ExecutiveSummary = {
  totalPeople: number
  LOW: number
  MEDIUM: number
  HIGH: number
  CRITICAL: number
}

export type ExecutiveReport = {
  summary: ExecutiveSummary
  peopleAtRisk: PersonAtRisk[]
}

export type PersonAtRisk = {
  personId: string
  name: string
  email?: string
  risk: RiskLevel
  progress: number
}
