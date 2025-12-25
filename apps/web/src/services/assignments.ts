import api from './api'

export type MyAssignment = {
  id: string
  progress: number
  risk: string
  track: {
    id: string
    title: string
  }
}

function unwrap<T>(res: any): T {
  return res?.data?.data ?? res?.data ?? res
}

export async function listMyAssignments(): Promise<MyAssignment[]> {
  const res = await api.get('/assignments/me')
  return unwrap<MyAssignment[]>(res)
}
