import PageHeader from '../../components/layout/PageHeader'
import { useTheme } from '../../theme/useTheme'

export default function Tracks() {
  const { styles } = useTheme()

  return (
    <div className="space-y-8">
      <PageHeader
        title="Trilhas"
        description="Crie e gerencie trilhas de treinamento para reduzir riscos jurídicos."
      />

      <div
        className={`
          rounded-xl border p-6
          ${styles.surface}
          ${styles.border}
        `}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <input
            placeholder="Nome da trilha"
            className="rounded-md border px-4 py-2 text-sm"
          />

          <input
            placeholder="Slug"
            className="rounded-md border px-4 py-2 text-sm"
          />
        </div>

        <textarea
          placeholder="Descrição (opcional)"
          className="mt-4 w-full rounded-md border px-4 py-2 text-sm"
        />

        <div className="mt-6 flex justify-end">
          <button className="rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-500">
            Criar trilha
          </button>
        </div>
      </div>
    </div>
  )
}
