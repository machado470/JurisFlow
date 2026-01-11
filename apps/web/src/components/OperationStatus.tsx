import { useAuth } from '../auth/AuthContext'

type OperationConfig = {
  label: string
  color: string
}

const MAP: Record<
  'NORMAL' | 'RESTRICTED' | 'SUSPENDED',
  OperationConfig
> = {
  NORMAL: {
    label: 'Operação normal',
    color: 'text-emerald-400',
  },
  RESTRICTED: {
    label: 'Operação restrita',
    color: 'text-amber-400',
  },
  SUSPENDED: {
    label: 'Operação suspensa',
    color: 'text-rose-400',
  },
}

export default function OperationStatus() {
  const { systemState } = useAuth()

  if (!systemState?.operational) {
    return null
  }

  const state = systemState.operational.state
  const config = MAP[state]

  return (
    <div
      className={`
        flex items-center gap-2
        text-sm font-medium
        ${config.color}
      `}
    >
      {/* Ícone de escudo */}
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
