import { useEffect, useState } from 'react'
import api from '../services/api'

export type MyAssignment = {
  id: string
  progress: number
  risk: string
  track: {
    id: string
    title: string
  }
}

export function useMyAssignments() {
  const [assignments, setAssignments] = useState<MyAssignment[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    try {
      const res = await api.get('/assignments/me')
      setAssignments(res.data.data ?? res.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return {
    assignments,
    loading,
    reload: load,
  }
}
