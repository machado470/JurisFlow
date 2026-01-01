import { useEffect, useState } from 'react'
import { listPeople } from '../services/persons'
import type { PersonSummary } from '../services/persons'

export function usePersons() {
  const [data, setData] = useState<PersonSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const people = await listPeople()
        setData(people)
      } catch (err) {
        console.error('[usePersons]', err)
        setError('Erro ao carregar pessoas')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  return {
    data,
    loading,
    error,
  }
}
