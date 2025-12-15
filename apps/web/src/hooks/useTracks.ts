import { Track } from '../types/track'
import { useOrganization } from './useOrganization'
import { orgKey } from '../utils/orgKey'

export function useTracks() {
  const { get } = useOrganization()
  const org = get()

  function storageKey() {
    if (!org) throw new Error('Organização não definida')
    return orgKey(org.id, 'tracks')
  }

  function load(): Track[] {
    const raw = localStorage.getItem(storageKey())
    return raw
      ? JSON.parse(raw)
      : []
  }

  function save(data: Track[]) {
    localStorage.setItem(storageKey(), JSON.stringify(data))
  }

  function list() {
    return load()
  }

  function add(track: Track) {
    const data = load()
    data.push(track)
    save(data)
  }

  return { list, add }
}
