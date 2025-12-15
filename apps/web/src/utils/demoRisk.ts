const KEY = 'demoRiskResolved'

export function isResolved(personId: string) {
  const raw = localStorage.getItem(KEY)
  if (!raw) return false
  return JSON.parse(raw).includes(personId)
}

export function markResolved(personId: string) {
  const raw = localStorage.getItem(KEY)
  const list: string[] = raw ? JSON.parse(raw) : []
  if (!list.includes(personId)) {
    list.push(personId)
    localStorage.setItem(KEY, JSON.stringify(list))
  }
}
