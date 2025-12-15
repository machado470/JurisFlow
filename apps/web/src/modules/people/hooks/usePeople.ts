import { api } from '../../../lib/api'
import { useOrg } from '../../organization/useOrg'

const LS_KEY = 'jurisflow_people'

export function usePeople() {
  const { orgKey } = useOrg()

  async function list() {
    try {
      const res = await api.get('/people', {
        params: { orgId: orgKey },
      })

      return res.data.data || []
    } catch (err) {
      // fallback local (modo demo / offline)
      const all = JSON.parse(localStorage.getItem(LS_KEY) || '[]')
      return all.filter((p: any) => p.orgKey === orgKey)
    }
  }

  async function create(person: any) {
    try {
      const res = await api.post('/people', {
        ...person,
        orgKey,
      })
      return res.data.data
    } catch {
      const all = JSON.parse(localStorage.getItem(LS_KEY) || '[]')
      localStorage.setItem(
        LS_KEY,
        JSON.stringify([...all, { ...person, orgKey }])
      )
    }
  }

  async function toggleActive(id: string) {
    // por enquanto local-only (não existe endpoint ainda)
    const all = JSON.parse(localStorage.getItem(LS_KEY) || '[]')
    const updated = all.map((p: any) =>
      p.id === id ? { ...p, active: !p.active } : p
    )
    localStorage.setItem(LS_KEY, JSON.stringify(updated))
  }

  return { list, create, toggleActive }
}
