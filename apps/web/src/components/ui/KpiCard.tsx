import Card from './Card'
import { useTheme } from '../../theme/ThemeContext'
import clsx from 'clsx'

type KpiStatus = 'success' | 'warning' | 'danger' | 'neutral'

type KpiCardProps = {
  label: string
  value: string | number
  unit?: string
  status?: KpiStatus
  hint?: string
}

export default function KpiCard({
  label,
  value,
  unit,
  status = 'neutral',
  hint,
}: KpiCardProps) {
  const { tokens } = useTheme()

  const statusColor: Record<KpiStatus, string> = {
    success: tokens.success,
    warning: tokens.warning,
    danger: tokens.danger,
    neutral: tokens.textMuted,
  }

  return (
    <Card>
      <div className="flex flex-col gap-1">
        {/* Label */}
        <span
          className="text-sm font-medium"
          style={{ color: tokens.textMuted }}
        >
          {label}
        </span>

        {/* Value */}
        <div
          className={clsx(
            'flex items-end gap-1',
            'text-3xl font-semibold leading-none'
          )}
          style={{ color: statusColor[status] }}
        >
          <span>{value}</span>

          {unit && (
            <span className="mb-0.5 text-base font-medium opacity-70">
              {unit}
            </span>
          )}
        </div>

        {/* Hint */}
        {hint && (
          <span
            className="mt-1 text-xs"
            style={{ color: tokens.textMuted }}
          >
            {hint}
          </span>
        )}
      </div>
    </Card>
  )
}
