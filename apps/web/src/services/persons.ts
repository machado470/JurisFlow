import api from './api'

export type PersonSummary = {
  id: string
  name: string
  email?: string
  role: string
  active: boolean
}

export async function listPeople(): Promise<PersonSummary[]> {
  const { data } = await api.get('/people')
  return data
}

export async function createPerson(params: {
  name: string
  email: string
  role: 'ADMIN' | 'COLLABORATOR'
}) {
  const { data } = await api.post('/people', params)
  return data
}
