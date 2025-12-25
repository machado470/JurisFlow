import api from './api'

export type Track = {
  id: string
  title: string
  slug: string
  description?: string
}

export async function listTracks() {
  const res = await api.get('/tracks')
  return res.data.data as Track[]
}

export async function createTrack(data: {
  title: string
  slug: string
  description?: string
}) {
  const res = await api.post('/tracks', data)
  return res.data.data as Track
}
