import useOrganization from './useOrganization'

export function useAdminDashboard() {
  const { get } = useOrganization()
  const org = get()

  if (!org) {
    return {
      stats: [],
      peopleAtRisk: [],
    }
  }

  return {
    stats: [],
    peopleAtRisk: [],
  }
}
