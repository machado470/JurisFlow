import { useTracks } from '../../hooks/useTracks'
import { useProgress } from '../../hooks/useProgress'
import { useAudit } from '../../hooks/useAudit'

export default function RiskReport() {
  const { list } = useTracks()
  const { attempts, isBlocked } = useProgress()
  const { list: audit } = useAudit()

  return (
    <div style={{ marginTop: 40 }}>
      <h2 style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
        Relatório de Risco
      </h2>

      {list().map(track => {
        const tries = attempts(track.id)
        const blocked = isBlocked(track.id)
        const events = audit(track.id)

        return (
          <div
            key={track.id}
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              padding: 16,
              marginBottom: 24,
            }}
          >
            <strong>{track.title}</strong>

            <p>
              Tentativas usadas: <strong>{tries}</strong> /{' '}
              {track.rule.maxAttempts}
            </p>

            <p>
              Status:{' '}
              <strong
                style={{
                  color: blocked ? '#dc2626' : '#16a34a',
                }}
              >
                {blocked ? 'RISCO / BLOQUEADO' : 'OK'}
              </strong>
            </p>

            <div style={{ marginTop: 12 }}>
              <p style={{ fontWeight: 'bold' }}>Eventos:</p>

              {events.length === 0 && (
                <p style={{ fontSize: 12, color: '#555' }}>
                  Nenhum evento crítico.
                </p>
              )}

              {events.map(e => (
                <p key={e.id} style={{ fontSize: 12 }}>
                  {new Date(e.createdAt).toLocaleString()} — {e.type}
                </p>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
