import { api } from '../../../lib/api'
import { useOrg } from '../../organization/useOrg'

export function usePersonRisk(personId: string) {
  const { orgKey } = useOrg()

  async function load() {
    const res = await api.get('/risk/person', {
      params: { orgId: orgKey, personId },
    })

    return res.data.data
  }

  return { load }
}
