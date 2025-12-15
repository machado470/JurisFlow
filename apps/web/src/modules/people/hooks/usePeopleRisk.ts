import { api } from '../../../lib/api'
import { useOrg } from '../../organization/useOrg'

export function usePeopleRisk() {
  const { orgKey } = useOrg()

  async function list() {
    const res = await api.get('/risk/people', {
      params: { orgId: orgKey },
    })

    return res.data?.data ?? []
  }

  return { list }
}
