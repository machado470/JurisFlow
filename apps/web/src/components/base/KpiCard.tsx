import Card from './Card'
import { useTheme } from '../../theme/ThemeProvider'

export default function KpiCard({
  label,
  value,
  hint,
}: {
  label: string
  value: string | number
  hint?: string
}) {
  const { styles } = useTheme()

  return (
    <Card className="flex flex-col gap-2">
      <span className={`text-xs uppercase tracking-wide ${styles.muted}`}>
        {label}
      </span>

      <span className="text-3xl font-semibold leading-none">
        {value}
      </span>

      {hint && (
        <span className={`text-xs ${styles.muted}`}>
          {hint}
        </span>
      )}
    </Card>
  )
}
