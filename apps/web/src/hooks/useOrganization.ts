import { Organization } from '../types/org'

const STORAGE_KEY = 'jurisflow:org'

export function useOrganization() {
  function get(): Organization | null {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  }

  function set(org: Organization) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(org))
  }

  function clear() {
    localStorage.removeItem(STORAGE_KEY)
  }

  return { get, set, clear }
}
