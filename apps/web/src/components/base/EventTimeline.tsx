import type {
  TimelineItem,
  TimelineSeverity,
  TimelineSource,
} from '../../services/timeline'

type Props = {
  events: TimelineItem[]
}

function severityTone(severity: TimelineSeverity) {
  switch (severity) {
    case 'CRITICAL':
      return 'border-red-500 text-red-400'
    case 'WARNING':
      return 'border-yellow-500 text-yellow-400'
    case 'SUCCESS':
      return 'border-green-500 text-green-400'
    default:
      return 'border-slate-600 text-slate-300'
  }
}

function sourceLabel(source: TimelineSource) {
  switch (source) {
    case 'AUDIT':
      return 'Decisão'
    case 'RISK':
      return 'Risco'
    case 'EVENT':
      return 'Evento'
  }
}

export default function EventTimeline({ events }: Props) {
  if (!events || events.length === 0) {
    return (
      <div className="text-sm text-slate-400">
        Nenhum evento registrado.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {events.map(e => (
        <div
          key={e.id}
          className={`rounded-xl border px-4 py-3 ${severityTone(
            e.severity,
          )}`}
        >
          <div className="flex items-center justify-between mb-1">
            <div className="font-semibold">{e.title}</div>
            <div className="text-xs opacity-70">
              {new Date(e.createdAt).toLocaleString()}
            </div>
          </div>

          <div className="text-sm opacity-90">
            {e.description}
          </div>

          {e.impact && (
            <div className="mt-1 text-xs italic opacity-80">
              Impacto: {e.impact}
            </div>
          )}

          <div className="mt-2 text-xs opacity-60">
            {sourceLabel(e.source)}
            {e.personName ? ` • ${e.personName}` : ''}
          </div>
        </div>
      ))}
    </div>
  )
}
