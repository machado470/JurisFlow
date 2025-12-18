import { useTheme } from '../../theme/ThemeContext'
import clsx from 'clsx'

type ProgressStatus = 'success' | 'warning' | 'danger'

type ProgressRowProps = {
  label: string
  value: number
  status?: ProgressStatus
}

export default function ProgressRow({
  label,
  value,
  status = 'success',
}: ProgressRowProps) {
  const { tokens } = useTheme()

  const colorByStatus: Record<ProgressStatus, string> = {
    success: tokens.success,
    warning: tokens.warning,
    danger: tokens.danger,
  }

  return (
    <div className="flex items-center gap-4">
      <div className="w-48 text-sm">
        {label}
      </div>

      <div className="flex-1">
        <div
          className="h-2 rounded-full"
          style={{
            backgroundColor: tokens.border,
          }}
        >
          <div
            className={clsx('h-2 rounded-full transition-all')}
            style={{
              width: `${value}%`,
              backgroundColor: colorByStatus[status],
            }}
          />
        </div>
      </div>

      <div className="w-12 text-right text-sm opacity-80">
        {value}%
      </div>
    </div>
  )
}
