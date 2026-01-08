import api from './api'

export async function startAssignment(id: string) {
  const { data } = await api.post(
    `/assignments/${id}/start`,
  )
  return data
}

export async function updateAssignmentProgress(
  id: string,
  progress: number,
) {
  const { data } = await api.patch(
    `/assignments/${id}/progress`,
    { progress },
  )
  return data
}

export async function completeAssignment(id: string) {
  const { data } = await api.post(
    `/assignments/${id}/complete`,
  )
  return data
}
