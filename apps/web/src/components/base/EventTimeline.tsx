import type { Event } from '../../models/Event'

type EventTimelineProps = {
  events: Event[]
}

function severityColor(severity: Event['severity']) {
  if (severity === 'CRITICAL') return 'text-red-500'
  if (severity === 'WARNING') return 'text-amber-500'
  return 'text-blue-400'
}

export default function EventTimeline({
  events,
}: EventTimelineProps) {
  if (events.length === 0) {
    return (
      <div className="text-sm opacity-60">
        Nenhum evento registrado.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {events.map(event => (
        <div
          key={event.id}
          className="rounded-lg border px-4 py-3"
        >
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">
              {event.type.replace('_', ' ')}
            </div>

            <div
              className={`text-xs font-semibold ${severityColor(
                event.severity
              )}`}
            >
              {event.severity}
            </div>
          </div>

          <div className="mt-1 text-sm opacity-70">
            {event.description}
          </div>

          <div className="mt-2 text-xs opacity-50">
            {new Date(event.date).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  )
}
