import api from './api'
import type { CorrectiveAction } from '../models/CorrectiveAction'

export async function listCorrectiveActions(
  personId: string,
) {
  const res = await api.get(
    `/corrective-actions/person/${personId}`,
  )
  return res.data as CorrectiveAction[]
}

export async function resolveCorrectiveAction(
  id: string,
) {
  const res = await api.post(
    `/corrective-actions/${id}/resolve`,
  )
  return res.data as CorrectiveAction
}
