import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { useTheme } from '../../theme/useTheme'

type DataPoint = {
  label: string
  critical: number
  high: number
  medium: number
}

type Props = {
  data?: DataPoint[]
}

const fallbackData: DataPoint[] = [
  { label: 'Seg', critical: 3, high: 5, medium: 8 },
  { label: 'Ter', critical: 2, high: 6, medium: 7 },
  { label: 'Qua', critical: 4, high: 5, medium: 6 },
  { label: 'Qui', critical: 3, high: 4, medium: 5 },
  { label: 'Sex', critical: 2, high: 3, medium: 4 },
]

export default function RiskTrendChart({ data }: Props) {
  const { styles } = useTheme()

  const chartData = data ?? fallbackData

  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <XAxis
            dataKey="label"
            stroke="currentColor"
            opacity={0.4}
          />
          <YAxis stroke="currentColor" opacity={0.3} />
          <Tooltip
            contentStyle={{
              background: 'rgba(15,42,68,0.95)',
              borderRadius: 8,
              border: `1px solid ${styles.border}`,
              color: '#fff',
            }}
          />
          <Legend />

          <Line
            name="Crítico"
            type="monotone"
            dataKey="critical"
            stroke={styles.chart.danger}
            strokeWidth={2}
            dot={false}
          />
          <Line
            name="Alto"
            type="monotone"
            dataKey="high"
            stroke={styles.chart.warning}
            strokeWidth={2}
            dot={false}
          />
          <Line
            name="Médio"
            type="monotone"
            dataKey="medium"
            stroke={styles.chart.primary}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

