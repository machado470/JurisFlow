import api from '../../../services/api'
import { useOrganization } from '../../../hooks/useOrganization'

type PersonRiskRow = {
  personId: string
  name: string
  role: string
  risk: 'OK' | 'ATENÇÃO' | 'CRÍTICO'
  incompleteMandatory: number
}

export function usePeopleRisk() {
  const { get } = useOrganization()
  const org = get()

  async function list(): Promise<PersonRiskRow[]> {
    // 👉 MODO DEMO (SEM BACKEND, SEM ORG)
    if (!org) {
      return [
        {
          personId: '1',
          name: 'Ana Souza',
          role: 'Advogada',
          risk: 'ATENÇÃO',
          incompleteMandatory: 1,
        },
        {
          personId: '2',
          name: 'Carlos Lima',
          role: 'Estagiário',
          risk: 'CRÍTICO',
          incompleteMandatory: 3,
        },
        {
          personId: '3',
          name: 'Mariana Rocha',
          role: 'Sócia',
          risk: 'OK',
          incompleteMandatory: 0,
        },
      ]
    }

    // 👉 MODO REAL
    const res = await api.get('/risk/people', {
      params: { orgId: org.id },
    })

    return res.data
  }

  return { list }
}
