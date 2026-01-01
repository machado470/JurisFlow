import api from './api'

export type TimelineSource = 'AUDIT' | 'EVENT' | 'RISK'
export type TimelineSeverity =
  | 'INFO'
  | 'WARNING'
  | 'CRITICAL'
  | 'SUCCESS'

export type TimelineItem = {
  id: string
  source: TimelineSource
  title: string
  description: string
  impact?: string | null
  severity: TimelineSeverity
  createdAt: string
  personName?: string
}

export async function getPersonTimeline(
  personId: string,
): Promise<TimelineItem[]> {
  const res = await api.get(`/timeline/person/${personId}`)
  return res.data.data
}
