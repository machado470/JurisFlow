import api from './api'

export function listPersons() {
  return api.get('/persons')
}

export function getPerson(id: string) {
  return api.get(`/persons/${id}`)
}

export function getPersonAssignments(id: string) {
  return api.get(`/persons/${id}/assignments`)
}

export function setPersonActive(id: string, active: boolean) {
  return api.patch(`/persons/${id}/active`, { active })
}
