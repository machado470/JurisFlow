import { useEffect, useState } from 'react'
import api from '../services/api'
import { useOrganization } from './useOrganization'

type DashboardData = {
  avgRisk: string
  fitPercentage: number
  people: {
    total: number
    critical: number
    attention: number
  }
}

export function useAdminDashboard() {
  const { get } = useOrganization()
  const org = get()

  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 👉 MODO DEMO quando não existe organização
    if (!org) {
      setData({
        avgRisk: 'ATENÇÃO',
        fitPercentage: 67,
        people: {
          total: 6,
          critical: 1,
          attention: 2,
        },
      })
      setLoading(false)
      return
    }

    api
      .get('/admin/dashboard', {
        params: { orgId: org.id },
      })
      .then(res => setData(res.data))
      .catch(() => {
        setData({
          avgRisk: 'ATENÇÃO',
          fitPercentage: 67,
          people: {
            total: 6,
            critical: 1,
            attention: 2,
          },
        })
      })
      .finally(() => setLoading(false))
  }, [org])

  return { data, loading }
}
