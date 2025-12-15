import { useNavigate } from 'react-router-dom'
import { tracks } from '../../mocks/education'
import { useProgress } from '../../hooks/useProgress'
import { useCertificate } from '../../hooks/useCertificate'

export default function Dashboard() {
  const navigate = useNavigate()
  const { get } = useProgress()
  const { get: getCertificate } = useCertificate()

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>
        JurisFlow
      </h1>

      <p style={{ marginBottom: 24, color: '#555' }}>
        Trilhas com validação jurídica por quiz.
      </p>

      {tracks.map(track => {
        const progress = get(track.id)
        const certificate = getCertificate(track.id)

        return (
          <div
            key={track.id}
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              padding: 16,
              marginBottom: 16,
            }}
          >
            <strong>{track.title}</strong>

            <div
              style={{
                height: 8,
                background: '#e5e7eb',
                borderRadius: 4,
                marginTop: 8,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  background: '#2563eb',
                  height: '100%',
                }}
              />
            </div>

            <p style={{ fontSize: 12, marginTop: 6 }}>
              Status:{' '}
              {progress === 100 ? 'Concluído' : 'Em andamento'}
            </p>

            {certificate ? (
              <button
                onClick={() => navigate(`/certificate/${track.id}`)}
                style={{
                  marginTop: 12,
                  padding: '6px 12px',
                  border: '1px solid #16a34a',
                  background: '#16a34a',
                  color: '#fff',
                  cursor: 'pointer',
                }}
              >
                Ver certificado
              </button>
            ) : (
              <button
                onClick={() => navigate(`/study/${track.id}`)}
                style={{
                  marginTop: 12,
                  padding: '6px 12px',
                  border: '1px solid #2563eb',
                  background: '#2563eb',
                  color: '#fff',
                  cursor: 'pointer',
                }}
              >
                Continuar
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}
