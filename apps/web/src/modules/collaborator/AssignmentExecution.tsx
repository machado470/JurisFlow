import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import Card from '../../components/base/Card'
import { useAssessment } from '../../hooks/useAssessment'

export default function AssignmentExecution() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { submit, loading } = useAssessment()
  const [score, setScore] = useState(70)

  async function handleFinish() {
    if (!id) return

    await submit({
      assignmentId: id,
      score,
    })

    navigate('/collaborator')
  }

  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-2xl font-semibold tracking-tight">
        Execução da atividade
      </h1>

      <Card>
        <div className="space-y-4">
          <p className="text-sm text-slate-400">
            Selecione o resultado da avaliação.
          </p>

          <select
            value={score}
            onChange={e =>
              setScore(Number(e.target.value))
            }
            className="
              w-full
              rounded-lg
              bg-white/5
              px-3
              py-2
              text-sm
              outline-none
              ring-1
              ring-white/10
              focus:ring-blue-500/40
            "
          >
            <option value={40}>
              Falhou (risco alto)
            </option>
            <option value={70}>Regular</option>
            <option value={100}>Excelente</option>
          </select>

          <button
            onClick={handleFinish}
            disabled={loading}
            className="
              rounded-lg
              bg-blue-600
              px-4
              py-2
              text-sm
              font-medium
              hover:bg-blue-500
              transition
              disabled:opacity-50
            "
          >
            {loading ? 'Enviando…' : 'Finalizar'}
          </button>
        </div>
      </Card>
    </div>
  )
}
