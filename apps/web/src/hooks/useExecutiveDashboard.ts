import { useMemo } from 'react'
import {
  usePeopleRisk,
  PersonInput,
} from './usePeopleRisk'

type ExecutiveStats = {
  people: number
  critical: number
  attention: number
  compliant: number
  complianceAvg: number
}

// 🔒 Fonte única (por enquanto mock; depois vem da API)
const PEOPLE_DATA: PersonInput[] = [
  {
    id: '1',
    name: 'Ana Silva',
    email: 'ana@empresa.com',
    compliance: 42,
    pending: 3,
  },
  {
    id: '2',
    name: 'Carlos Souza',
    email: 'carlos@empresa.com',
    compliance: 68,
    pending: 1,
  },
  {
    id: '3',
    name: 'Marina Lopes',
    email: 'marina@empresa.com',
    compliance: 100,
    pending: 0,
  },
]

export function useExecutiveDashboard() {
  const people = usePeopleRisk(PEOPLE_DATA)

  const stats = useMemo<ExecutiveStats>(() => {
    const total = people.length

    const critical = people.filter(
      p => p.status === 'CRITICO'
    ).length

    const attention = people.filter(
      p => p.status === 'ATENCAO'
    ).length

    const compliant = people.filter(
      p => p.status === 'APTO'
    ).length

    const complianceAvg =
      Math.round(
        people.reduce(
          (sum, p) => sum + p.compliance,
          0
        ) / total
      ) || 0

    return {
      people: total,
      critical,
      attention,
      compliant,
      complianceAvg,
    }
  }, [people])

  return {
    stats,
    mode: 'real' as const,
  }
}
