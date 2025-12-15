import { useEffect, useState } from 'react'
import { listAssignments, completeAssignment } from '../services/assignments'
import useOrganization from './useOrganization'

export function useAssignments(personId: string) {
  const { get } = useOrganization()
  const org = get()

  const [assignments, setAssignments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  function load() {
    if (!org) return
    setLoading(true)

    listAssignments(org.id, personId)
      .then(setAssignments)
      .finally(() => setLoading(false))
  }

  function complete(id: string) {
    return completeAssignment(id).then(load)
  }

  useEffect(() => {
    load()
  }, [personId])

  return {
    assignments,
    loading,
    complete,
    reload: load,
  }
}
