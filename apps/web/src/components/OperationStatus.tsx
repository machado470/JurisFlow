import { useAuth } from '../auth/AuthContext'

export default function OperationStatus() {
  const { systemState } = useAuth()

  const urgency = systemState?.urgency ?? 'NORMAL'

  const config = {
    NORMAL: {
      label: 'Operação segura',
      color: 'text-emerald-400',
    },
    WARNING: {
      label: 'Atenção',
      color: 'text-amber-400',
    },
    CRITICAL: {
      label: 'Risco crítico',
      color: 'text-rose-400',
    },
  }[urgency]

  return (
    <div
      className={`
        flex items-center gap-2
        text-sm font-medium
        ${config.color}
      `}
    >
      {/* Shield icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 3l8 4v5c0 5-3.5 9-8 10-4.5-1-8-5-8-10V7l8-4z" />
      </svg>

      <span>{config.label}</span>
    </div>
  )
}
