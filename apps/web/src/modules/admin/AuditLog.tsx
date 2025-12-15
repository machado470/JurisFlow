import { useAudit } from '../../hooks/useAudit'
import { useTracks } from '../../hooks/useTracks'

export default function AuditLog() {
  const { list } = useAudit()
  const { list: listTracks } = useTracks()

  const events = list()
  const tracks = listTracks()

  function trackName(trackId: string) {
    return tracks.find(t => t.id === trackId)?.title ?? trackId
  }

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
        Auditoria de Atividades
      </h2>

      {events.length === 0 && (
        <p style={{ color: '#555' }}>
          Nenhum evento registrado.
        </p>
      )}

      {events.map(event => (
        <div
          key={event.id}
          style={{
            borderLeft: '4px solid #2563eb',
            paddingLeft: 12,
            marginBottom: 16,
          }}
        >
          <p style={{ fontSize: 12, color: '#555' }}>
            {new Date(event.createdAt).toLocaleString()}
          </p>

          <p style={{ fontWeight: 'bold' }}>
            {trackName(event.trackId)}
          </p>

          <p>{event.message}</p>

          <p style={{ fontSize: 12, color: '#2563eb' }}>
            {event.type}
          </p>
        </div>
      ))}
    </div>
  )
}
