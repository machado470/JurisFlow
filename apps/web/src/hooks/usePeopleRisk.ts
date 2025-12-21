export type PersonStatus = 'APTO' | 'ATENCAO' | 'CRITICO'

export type PersonInput = {
  id: string
  name: string
  email: string
  compliance: number
  pending: number
}

export function calculateStatus(
  p: PersonInput
): PersonStatus {
  if (p.compliance < 60 || p.pending >= 2) {
    return 'CRITICO'
  }

  if (
    (p.compliance >= 60 && p.compliance < 80) ||
    p.pending === 1
  ) {
    return 'ATENCAO'
  }

  return 'APTO'
}

export function usePeopleRisk(data: PersonInput[]) {
  return data.map(p => ({
    ...p,
    status: calculateStatus(p),
  }))
}
