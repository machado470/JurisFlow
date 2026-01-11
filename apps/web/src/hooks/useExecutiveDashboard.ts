import { useEffect, useMemo, useState } from 'react'
import {
  getExecutiveReport,
  type ExecutiveReport,
} from '../services/reports'

export function useExecutiveDashboard() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<ExecutiveReport | null>(null)

  async function load() {
    setLoading(true)
    try {
      const report = await getExecutiveReport()
      setData(report)
    } catch {
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return useMemo(
    () => ({
      loading,
      data,

      peopleStats: data?.peopleStats ?? {
        OK: 0,
        WARNING: 0,
        CRITICAL: 0,
      },

      correctiveOpenCount:
        data?.correctiveOpenCount ?? 0,

      people: data?.people ?? [],

      reload: load,
    }),
    [loading, data],
  )
}
