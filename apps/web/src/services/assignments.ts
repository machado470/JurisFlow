import api from './api'

export function listAssignments(orgId: string, personId: string) {
  return api.get('/assignments', {
    params: { orgId, personId },
  }).then(res => res.data)
}

export function completeAssignment(id: string) {
  return api.post(`/assignments/${id}/complete`)
}
