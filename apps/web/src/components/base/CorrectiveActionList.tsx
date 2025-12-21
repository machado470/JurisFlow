import type { CorrectiveAction } from '../../models/CorrectiveAction'
import StatusBadge from './StatusBadge'

function toneFromStatus(status: CorrectiveAction['status']) {
  if (status === 'DONE') return 'success'
  if (status === 'IN_PROGRESS') return 'warning'
  return 'critical'
}

export default function CorrectiveActionList({
  actions,
}: {
  actions: CorrectiveAction[]
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
          className="flex items-center justify-between"
        >
          <div>
            <div className="font-medium text-sm">
              {action.title}
            </div>
            {action.description && (
              <div className="text-xs opacity-60">
                {action.description}
              </div>
            )}
          </div>

          <StatusBadge
            label={action.status}
            tone={toneFromStatus(action.status)}
          />
        </div>
      ))}
    </div>
  )
}
