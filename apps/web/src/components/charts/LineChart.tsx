import { useTheme } from '../../theme/useTheme'

type Props = {
  title?: string
  data: number[]
  labels: string[]
}

export function LineChart({ title, data, labels }: Props) {
  const { styles } = useTheme()

  if (!data || data.length === 0) {
    return <div className={styles.muted}>Sem dados</div>
  }

  const max = Math.max(...data)

  return (
    <div className="space-y-3">
      {title && (
        <h3 className={`text-sm font-medium ${styles.muted}`}>
          {title}
        </h3>
      )}

      <svg viewBox="0 0 100 40" className="w-full h-28">
        <polyline
          fill="none"
          stroke={styles.chart.primary}
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
          points={data
            .map((value, index) => {
              const x = (index / (data.length - 1)) * 100
              const y = 40 - (value / max) * 36
              return `${x},${y}`
            })
            .join(' ')}
        />
      </svg>

      <div className={`flex justify-between text-xs ${styles.muted}`}>
        {labels.map(label => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
  )
}
