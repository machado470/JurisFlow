import { useTheme } from '../../theme/useTheme'

export default function PeopleRiskDashboard() {
  const { styles } = useTheme()

  return (
    <div
      className={`
        rounded-lg border p-6
        ${styles.surface}
        ${styles.border}
      `}
    >
      <h2 className="text-lg font-semibold mb-2">
        Risco por Pessoas
      </h2>

      <p className="text-sm opacity-60">
        Dashboard de risco será exibido aqui.
      </p>
    </div>
  )
}
