import useOrganization from './useOrganization'

export function useProgress() {
  const { get } = useOrganization()
  const org = get()

  function getProgress(personId: string, trackId: string) {
    if (!org) return 0
    return 0
  }

  return { get: getProgress }
}
