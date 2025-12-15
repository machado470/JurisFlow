import { useOrganization } from './useOrganization'
import { orgKey } from '../utils/orgKey'

type ProgressMap = Record<
  string,
  { progress: number; attempts: number; blocked: boolean }
>

export function useProgress() {
  const { get } = useOrganization()
  const org = get()

  function key() {
    if (!org) throw new Error('Organização não definida')
    return orgKey(org.id, 'progress')
  }

  function load(): ProgressMap {
    const raw = localStorage.getItem(key())
    return raw ? JSON.parse(raw) : {}
  }

  function save(data: ProgressMap) {
    localStorage.setItem(key(), JSON.stringify(data))
  }

  function getProgress(trackId: string) {
    return load()[trackId]?.progress ?? 0
  }

  function attempts(trackId: string) {
    return load()[trackId]?.attempts ?? 0
  }

  function isBlocked(trackId: string) {
    return load()[trackId]?.blocked ?? false
  }

  function fail(trackId: string, maxAttempts: number) {
    const data = load()
    const current = data[trackId] ?? {
      progress: 0,
      attempts: 0,
      blocked: false,
    }

    const attempts = current.attempts + 1

    data[trackId] = {
      progress: 0,
      attempts,
      blocked: attempts >= maxAttempts,
    }

    save(data)
  }

  function complete(trackId: string) {
    const data = load()
    data[trackId] = { progress: 100, attempts: 0, blocked: false }
    save(data)
  }

  function reset(trackId: string) {
    const data = load()
    data[trackId] = { progress: 0, attempts: 0, blocked: false }
    save(data)
  }

  return {
    get: getProgress,
    attempts,
    isBlocked,
    fail,
    complete,
    reset,
  }
}
