import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAssessment } from '../../hooks/useAssessment'

export default function CollaboratorAssessment() {
  const { assignmentId } = useParams()
  const navigate = useNavigate()
  const { submit, loading } = useAssessment()

  const [score, setScore] = useState(0)

  async function handleSubmit() {
    if (!assignmentId) return

    await submit({
      assignmentId,
      score,
    })

    navigate('/collaborator')
  }

  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-2xl font-bold">
        Avaliação
      </h1>

      <p className="opacity-70">
        Responda a avaliação para concluir a trilha.
      </p>

      <div className="space-y-3">
        <label className="block text-sm">
          Nota (0 a 100)
        </label>

        <input
          type="number"
          min={0}
          max={100}
          value={score}
          onChange={e => setScore(Number(e.target.value))}
          className="w-full rounded border px-3 py-2"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
      >
        {loading ? 'Enviando…' : 'Enviar avaliação'}
      </button>
    </div>
  )
}
