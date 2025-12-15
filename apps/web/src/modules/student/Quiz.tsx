import { useParams, useNavigate } from 'react-router-dom'
import { quizzes } from '../../mocks/quiz'
import { useState } from 'react'
import { useProgress } from '../../hooks/useProgress'
import { useTracks } from '../../hooks/useTracks'
import { useAudit } from '../../hooks/useAudit'

export default function Quiz() {
  const { lessonId } = useParams()
  const navigate = useNavigate()

  const { fail, complete, attempts, isBlocked } = useProgress()
  const { list } = useTracks()
  const { log } = useAudit()

  const quiz = quizzes.find(q => q.lessonId === lessonId)
  if (!quiz) return <p>Quiz não encontrado.</p>

  const trackId = quiz.lessonId.split('-')[0]
  const track = list().find(t => t.id === trackId)
  const maxAttempts = track?.rule.maxAttempts ?? 3

  if (isBlocked(trackId)) {
    return <p>❌ Acesso bloqueado. Procure o administrador.</p>
  }

  const [selected, setSelected] = useState<string | null>(null)
  const [error, setError] = useState('')

  function submit() {
    const option = quiz.options.find(o => o.id === selected)

    if (!option) {
      setError('Selecione uma opção.')
      return
    }

    if (!option.correct) {
      fail(trackId, maxAttempts)

      log(
        trackId,
        'QUIZ_FAILED',
        `Resposta incorreta no quiz ${quiz.id}`
      )

      setError(
        `Resposta incorreta. Tentativas restantes: ${
          maxAttempts - (attempts(trackId) + 1)
        }`
      )
      return
    }

    complete(trackId)

    log(
      trackId,
      'QUIZ_PASSED',
      `Quiz ${quiz.id} aprovado`
    )

    navigate('/dashboard')
  }

  return (
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
        Quiz
      </h1>

      <p style={{ marginBottom: 12 }}>{quiz.question}</p>

      {quiz.options.map(opt => (
        <label key={opt.id} style={{ display: 'block' }}>
          <input
            type="radio"
            name="quiz"
            onChange={() => setSelected(opt.id)}
          />{' '}
          {opt.text}
        </label>
      ))}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button
        onClick={submit}
        style={{
          marginTop: 16,
          padding: '8px 16px',
          background: '#2563eb',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Confirmar resposta
      </button>
    </div>
  )
}
