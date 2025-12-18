export type Person = {
  id: string
  name: string
  role: string
  trackId: string
  conformity: number
  risk: 'success' | 'warning' | 'danger'
}

export const people: Person[] = [
  {
    id: 'p1',
    name: 'Ana Souza',
    role: 'Advogada',
    trackId: 'contracts',
    conformity: 82,
    risk: 'success',
  },
  {
    id: 'p2',
    name: 'Carlos Lima',
    role: 'Advogado',
    trackId: 'contracts',
    conformity: 55,
    risk: 'warning',
  },
  {
    id: 'p3',
    name: 'Marina Alves',
    role: 'Assistente Jurídica',
    trackId: 'compliance',
    conformity: 42,
    risk: 'danger',
  },
]
