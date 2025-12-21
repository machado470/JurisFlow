import { useEffect, useState } from 'react'
import { listPersons } from '../services/persons'

export type Person = {
  id: string
  name: string
  email?: string
  role: string
  active: boolean
}

export function usePersons() {
  const [data, setData] = useState<Person[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await listPersons()
        setData(res.data ?? [])
      } catch (err) {
        console.error('[usePersons]', err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  return { data, loading }
}
