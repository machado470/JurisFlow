export type RiskLevel = 'ALTO' | 'MEDIO' | 'MONITORAMENTO'

export type PersonRisk = {
  name: string
  score: number
  pendingTracks: number
}

export const peopleData: PersonRisk[] = [
  { name: 'Carlos Almeida', score: 90, pendingTracks: 2 },
  { name: 'Fernanda Souza', score: 65, pendingTracks: 1 },
  { name: 'João Pereira', score: 88, pendingTracks: 2 },
]
