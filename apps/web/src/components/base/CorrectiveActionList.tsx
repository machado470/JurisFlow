import type { CorrectiveAction } from '../../models/CorrectiveAction'
import StatusBadge from './StatusBadge'

function toneFromStatus(status: CorrectiveAction['status']) {
  if (status === 'DONE') return 'success'
  if (status === 'IN_PROGRESS') return 'warning'
  return 'critical'
}

export default function CorrectiveActionList({
  actions,
  onResolve,
}: {
  actions: CorrectiveAction[]
  onResolve?: (id: string) => void
}) {
  if (actions.length === 0) {
    return (
      <div className="text-sm opacity-60">
        Nenhuma ação corretiva registrada.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {actions.map(action => (
        <div
          key={action.id}
          className="flex items-center justify-between gap-4"
        >
          <div>
            <div className="font-medium text-sm">
              {action.reason}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <StatusBadge
              label={action.status}
              tone={toneFromStatus(action.status)}
            />

            {action.status !== 'DONE' &&
              onResolve && (
                <button
                  onClick={() =>
                    onResolve(action.id)
                  }
                  className="text-xs bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded"
                >
                  Concluir
                </button>
              )}
          </div>
        </div>
      ))}
    </div>
  )
}
