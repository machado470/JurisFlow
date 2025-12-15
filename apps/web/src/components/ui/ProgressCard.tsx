import { useTheme } from '../../theme/ThemeProvider'

export function ProgressCard({
  label,
  percent,
  color,
}: {
  label: string
  percent: number
  color: string
}) {
  const { styles } = useTheme()

  return (
    <div className={`p-4 rounded-xl border ${styles.card} ${styles.border}`}>
      <div className="flex justify-between mb-1">
        <span className={styles.text}>{label}</span>
        <span className={styles.text}>{percent}%</span>
      </div>

      <div className="h-2 rounded bg-black/20">
        <div
          className={`h-2 rounded ${color}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
