import api from './api'

export function getExecutiveReport(orgId: string) {
  return api.get('/reports/executive', {
    params: { orgId },
  }).then(res => res.data)
}
