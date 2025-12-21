export type CorrectiveActionStatus =
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'DONE'

export type CorrectiveAction = {
  id: string
  personId: string
  title: string
  description?: string
  status: CorrectiveActionStatus
  createdAt: string
}
