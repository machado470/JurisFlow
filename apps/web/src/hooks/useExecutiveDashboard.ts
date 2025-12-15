import { useEffect, useState } from 'react'
import useOrganization from './useOrganization'
import api from '../services/api'
import { isResolved } from '../utils/demoRisk'

type Stat = {
  label: string
  value: number
  danger?: boolean
}

export function useExecutiveDashboard() {
  const { get } = useOrganization()
  const org = get()

  const [stats, setStats] = useState<Stat[]>([])
  const [peopleAtRisk, setPeopleAtRisk] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [mode, setMode] = useState<'demo' | 'real'>('demo')

  useEffect(() => {
    if (!org) {
      setMode('demo')

      const allPeople = [
        { personId: '1', name: 'João Silva', risk: 'CRÍTICO' },
        { personId: '2', name: 'Maria Souza', risk: 'ATENÇÃO' },
      ]

      const filtered = allPeople.filter(p => !isResolved(p.personId))
      const critical = filtered.filter(p => p.risk === 'CRÍTICO').length

      setPeopleAtRisk(filtered)
      setStats([
        { label: 'Colaboradores', value: 12 },
        { label: 'Trilhas ativas', value: 5 },
        { label: 'Ações pendentes', value: filtered.length, danger: filtered.length > 0 },
        { label: 'Risco crítico', value: critical, danger: critical > 0 },
      ])

      setLoading(false)
      return
    }

    setMode('real')
    setLoading(true)

    api
      .get('/admin/executive', { params: { orgId: org.id } })
      .then(res => {
        setStats(res.data.stats ?? [])
        setPeopleAtRisk(res.data.peopleAtRisk ?? [])
      })
      .finally(() => setLoading(false))
  }, [org])

  return { stats, peopleAtRisk, loading, mode }
}
