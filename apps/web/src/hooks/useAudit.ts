import useOrganization from './useOrganization'
import api from '../services/api'

export function useAudit() {
  const { get } = useOrganization()
  const org = get()

  function list() {
    if (!org) return Promise.resolve([])
    return api.get('/audit', { params: { orgId: org.id } })
      .then(res => res.data)
  }

  return { list }
}
