import api from './api'

export type PersonSummary = {
  id: string
  name: string
  email?: string
  role: string
  active: boolean
}

export async function listPeople(): Promise<PersonSummary[]> {
  const { data } = await api.get('/persons')
  return data
}

export async function createPerson(params: {
  name: string
  email: string
  role: 'ADMIN' | 'COLLABORATOR'
}) {
  const { data } = await api.post('/persons', params)
  return data
}
