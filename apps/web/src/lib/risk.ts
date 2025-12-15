import { RiskLevel } from '../data/demo'

export function calculateRisk(score: number): RiskLevel {
  if (score >= 85) return 'ALTO'
  if (score >= 60) return 'MEDIO'
  return 'MONITORAMENTO'
}

export function riskColor(risk: RiskLevel) {
  switch (risk) {
    case 'ALTO':
      return 'text-red-500'
    case 'MEDIO':
      return 'text-yellow-400'
    default:
      return 'text-green-400'
  }
}
