import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Card from '../../components/ui/Card'
import { useAssessment } from '../../hooks/useAssessment'

export default function CollaboratorAssessment() {
  const { assignmentId } = useParams()
  const navigate = useNavigate()
  const { submit, loading, success } = useAssessment()

  const [score, setScore] = useState(0)
  const [notes, setNotes] = useState('')

  async function handleSubmit() {
    if (!assignmentId) return

    await submit({
      assignmentId,
      score,
      notes,
    })
  }

  if (success) {
    return (
      <Card title="Avaliação enviada">
        <p className="opacity-70">
          Sua avaliação foi registrada com sucesso.
        </p>

        <button
          onClick={() => navigate('/collaborator')}
          className="mt-4 text-blue-400 hover:underline"
        >
          Voltar para meu painel →
        </button>
      </Card>
    )
  }

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-bold">
        Avaliação
      </h1>

      <Card title="Informe seu desempenho">
        <div className="space-y-4">
          <div>
            <label className="text-sm opacity-70">
              Nota (0 a 100)
            </label>
            <input
              type="number"
              min={0}
              max={100}
              value={score}
              onChange={e => setScore(Number(e.target.value))}
              className="w-full mt-1 p-2 rounded bg-black/20"
            />
          </div>

          <div>
            <label className="text-sm opacity-70">
              Observações (opcional)
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full mt-1 p-2 rounded bg-black/20"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 p-2 rounded"
          >
            {loading ? 'Enviando...' : 'Enviar avaliação'}
          </button>
        </div>
      </Card>
    </div>
  )
}
