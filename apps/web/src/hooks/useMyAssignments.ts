import { useEffect, useState } from 'react'
import { listMyAssignments } from '../services/assignments'
import type { MyAssignment } from '../services/assignments'

export function useMyAssignments() {
  const [assignments, setAssignments] = useState<MyAssignment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const data = await listMyAssignments()
        setAssignments(data)
      } catch (err) {
        console.error('[useMyAssignments]', err)
        setError('Erro ao carregar atividades')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  return {
    assignments,
    loading,
    error,
  }
}
