import { useEffect, useState } from 'react'
import api from '../services/api'
import type { AuditEvent } from '../services/timeline'
import type { Assignment } from '../auth/AuthContext'

export function usePersonDetail(personId: string) {
  const [loading, setLoading] = useState(true)
  const [person, setPerson] = useState<any>(null)
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [audit, setAudit] = useState<AuditEvent[]>([])

  async function load() {
    setLoading(true)
    try {
      const res = await api.get(`/people/${personId}`)
      setPerson(res.data.person)
      setAssignments(res.data.assignments ?? [])
      setAudit(res.data.audit ?? [])
    } catch {
      setPerson(null)
      setAssignments([])
      setAudit([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (personId) load()
  }, [personId])

  return {
    loading,
    person,
    assignments,
    audit,
    reload: load,
  }
}
