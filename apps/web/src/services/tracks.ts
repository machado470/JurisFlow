import api from './api'

export type Track = {
  id: string
  title: string
  description?: string
  slug: string
  assignmentsCount: number
  createdAt: string
}

export async function getTracks(): Promise<Track[]> {
  const { data } = await api.get('/tracks')
  return data
}

export async function getTrack(id: string): Promise<Track> {
  const { data } = await api.get(`/tracks/${id}`)
  return data
}

export async function createTrack(params: {
  title: string
  description?: string
}) {
  const { data } = await api.post('/tracks', params)
  return data
}

export async function assignPeopleToTrack(params: {
  trackId: string
  personIds: string[]
}) {
  const { trackId, personIds } = params
  const { data } = await api.post(
    `/tracks/${trackId}/assign`,
    { personIds },
  )
  return data
}
