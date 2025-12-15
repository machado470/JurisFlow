import { useTheme } from '../../theme/ThemeProvider'

export function MetricCard({ title, value }: { title: string; value: string }) {
  const { styles } = useTheme()

  return (
    <div className={`p-4 rounded-xl border ${styles.card} ${styles.border}`}>
      <p className={`text-sm ${styles.subtext}`}>{title}</p>
      <p className={`text-3xl font-bold ${styles.text}`}>{value}</p>
    </div>
  )
}
