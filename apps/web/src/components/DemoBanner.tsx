import { useOrganization } from '../hooks/useOrganization'

export function DemoBanner() {
  const { get } = useOrganization()
  const org = get()

  if (org) return null

  return (
    <div className="bg-yellow-100 text-yellow-900 text-sm px-4 py-2 text-center border-b border-yellow-300">
      ⚠️ Modo demonstração — dados simulados para apresentação do sistema
    </div>
  )
}
