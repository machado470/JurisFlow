import { api } from '../../../lib/api'
import { useOrg } from '../../organization/useOrg'

const LS_KEY = 'jurisflow_assignments'

export function useAssignments() {
  const { orgKey } = useOrg()

  async function list() {
    try {
      const res = await api.get('/assignments', {
        params: { orgId: orgKey },
      })

      return res.data.data || []
    } catch {
      const all = JSON.parse(localStorage.getItem(LS_KEY) || '[]')
      return all.filter((a: any) => a.orgKey === orgKey)
    }
  }

  async function listByPerson(personId: string) {
    try {
      const res = await api.get('/assignments', {
        params: { orgId: orgKey, personId },
      })

      return res.data.data || []
    } catch {
      const all = JSON.parse(localStorage.getItem(LS_KEY) || '[]')
      return all.filter(
        (a: any) => a.orgKey === orgKey && a.personId === personId
      )
    }
  }

  async function assign(data: {
    personId: string
    trackId: string
    mandatory: boolean
    dueAt?: string
  }) {
    const payload = {
      id: crypto.randomUUID(),
      orgKey,
      ...data,
      createdAt: new Date().toISOString(),
    }

    try {
      await api.post('/assignments', payload)
    } catch {
      const all = JSON.parse(localStorage.getItem(LS_KEY) || '[]')
      localStorage.setItem(LS_KEY, JSON.stringify([...all, payload]))
    }
  }

  return { list, listByPerson, assign }
}
