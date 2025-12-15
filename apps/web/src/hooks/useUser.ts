import { User } from '../types/user'

const STORAGE_KEY = 'jurisflow:user'

export function useUser() {
  function get(): User | null {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  }

  function set(user: User) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  }

  function clear() {
    localStorage.removeItem(STORAGE_KEY)
  }

  return { get, set, clear }
}
