import { useEffect, useState } from 'react'
import { DEMO_MODE } from '../config/demo'
import { api } from '../services/api'

type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

type PersonAtRisk = {
  personId: string
  name: string
  email: string
  risk: RiskLevel
  progress: number
  assignments: number
}

type ExecutiveStats = {
  totalPeople: number
  critical: number
  high: number
  medium: number
  low: number
}

export function useExecutiveDashboard() {
  const [stats, setStats] = useState<ExecutiveStats | null>(null)
  const [peopleAtRisk, setPeopleAtRisk] = useState<PersonAtRisk[]>([])
  const [loading, setLoading] = useState(true)
  const [mode, setMode] = useState<'demo' | 'live'>('demo')

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)

        // 🧪 DEMO MODE (mantém comportamento atual)
        if (DEMO_MODE) {
          const demo = await import('../demo/executive-demo')
          setStats(demo.stats)
          setPeopleAtRisk(demo.peopleAtRisk)
          setMode('demo')
          return
        }

        // 🚀 LIVE MODE (backend real)
        const res = await api.get('/reports/executive')

        const data = res.data.data

        setStats({
          totalPeople: data.summary.totalPeople,
          critical: data.summary.critical,
          high: data.summary.high,
          medium: data.summary.medium,
          low: data.summary.low,
        })

        setPeopleAtRisk(data.peopleAtRisk)
        setMode('live')
      } catch (err) {
        console.error('Erro ao carregar dashboard executivo', err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  return {
    stats,
    peopleAtRisk,
    loading,
    mode,
  }
}
