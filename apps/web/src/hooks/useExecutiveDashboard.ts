import { useEffect, useState } from 'react'
import api from '../services/api'

type Summary = {
  totalPeople: number
  LOW: number
  MEDIUM: number
  HIGH: number
  CRITICAL: number
}

type PersonAtRisk = {
  id: string
  name: string
  risk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
}

export function useExecutiveDashboard() {
  const [summary, setSummary] = useState<Summary | null>(null)
  const [peopleAtRisk, setPeopleAtRisk] = useState<PersonAtRisk[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    const res = await api.get('/reports/executive')

    setSummary(res.data.data.summary)
    setPeopleAtRisk(res.data.data.peopleAtRisk)

    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  return {
    loading,
    summary,
    peopleAtRisk,
  }
}
