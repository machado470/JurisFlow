import { useParams, useNavigate } from 'react-router-dom'
import { lessons, tracks } from '../../mocks/education'
import { useProgress } from '../../hooks/useProgress'

export default function Study() {
  const { trackId } = useParams()
  const navigate = useNavigate()
  const { get } = useProgress()

  const track = tracks.find(t => t.id === trackId)
  const lesson = lessons.find(l => l.trackId === trackId)
  const progress = trackId ? get(trackId) : 0

  if (!track || !lesson) {
    return <p>Conteúdo não encontrado.</p>
  }

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 12 }}>
        {track.title}
      </h1>

      <p style={{ marginBottom: 16 }}>
        Aula: {lesson.title}
      </p>

      <div
        style={{
          border: '1px solid #e5e7eb',
          padding: 16,
          borderRadius: 8,
          marginBottom: 24,
        }}
      >
        {lesson.content}
      </div>

      {progress < 100 ? (
        <button
          onClick={() => navigate(`/quiz/${lesson.id}`)}
          style={{
            padding: '8px 16px',
            border: '1px solid #2563eb',
            background: '#2563eb',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          Ir para o quiz
        </button>
      ) : (
        <p style={{ color: '#16a34a', fontWeight: 'bold' }}>
          ✔ Aula concluída — modo revisão
        </p>
      )}
    </div>
  )
}
