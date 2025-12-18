import { useEffect, useState } from 'react'
import api from '../services/api'

export type Assignment = {
  id: string
  progress: number
  risk: string
  track: {
    id: string
    title: string
  }
}

export type AuditEvent = {
  id: string
  action: string
  context?: string
  createdAt: string
}

export function usePersonDetail(personId?: string) {
  const [person, setPerson] = useState<any>(null)
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [audit, setAudit] = useState<AuditEvent[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    if (!personId) return

    setLoading(true)
    try {
      const res = await api.get(`/persons/${personId}`)
      setPerson(res.data.data.person)
      setAssignments(res.data.data.assignments ?? [])
      setAudit(res.data.data.audit ?? [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [personId])

  return {
    person,
    assignments,
    audit,
    loading,
  }
}
