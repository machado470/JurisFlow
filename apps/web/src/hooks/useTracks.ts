import useOrganization from './useOrganization'
import api from '../services/api'

export function useTracks() {
  const { get } = useOrganization()
  const org = get()

  function list() {
    if (!org) return []
    return []
  }

  return { list }
}
