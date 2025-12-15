import { AuditEvent, AuditEventType } from '../types/audit'
import { useOrganization } from './useOrganization'
import { useUser } from './useUser'
import { orgKey } from '../utils/orgKey'

export function useAudit() {
  const { get: getOrg } = useOrganization()
  const { get: getUser } = useUser()

  function key() {
    const org = getOrg()
    if (!org) throw new Error('Organização não definida')
    return orgKey(org.id, 'audit')
  }

  function load(): AuditEvent[] {
    const raw = localStorage.getItem(key())
    return raw ? JSON.parse(raw) : []
  }

  function save(data: AuditEvent[]) {
    localStorage.setItem(key(), JSON.stringify(data))
  }

  function log(
    trackId: string,
    type: AuditEventType,
    message: string
  ) {
    const user = getUser()
    const data = load()

    data.unshift({
      id: crypto.randomUUID(),
      trackId,
      type,
      message: user
        ? `[${user.name} - ${user.email}] ${message}`
        : message,
      createdAt: new Date().toISOString(),
    })

    save(data)
  }

  function list(trackId?: string) {
    const data = load()
    return trackId ? data.filter(e => e.trackId === trackId) : data
  }

  return { log, list }
}
