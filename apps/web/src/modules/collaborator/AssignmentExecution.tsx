import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../services/api'
import PageHeader from '../../components/base/PageHeader'
import Card from '../../components/base/Card'

type Assignment = {
  id: string
  progress: number
  track: {
    id: string
    title: string
  }
}

export default function AssignmentExecution() {
  const { assignmentId } = useParams<{ assignmentId: string }>()
  const navigate = useNavigate()

  const [assignment, setAssignment] = useState<Assignment | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!assignmentId) {
      navigate('/execucao', { replace: true })
      return
    }

    api
      .get(`/assignments/${assignmentId}`)
      .then(res => {
        const data = res.data
        if (!data) {
          navigate('/execucao', { replace: true })
          return
        }
        setAssignment(data)
      })
      .catch(() => {
        navigate('/execucao', { replace: true })
      })
      .finally(() => setLoading(false))
  }, [assignmentId, navigate])

  if (loading) {
    return (
      <div className="p-6">
        <Card className="p-6">
          Carregando atividade…
        </Card>
      </div>
    )
  }

  if (!assignment) {
    // Redundância defensiva (não deve renderizar)
    return null
  }

  async function handleStart() {
    await api.post(`/assignments/${assignment.id}/start`)
    setAssignment({ ...assignment, progress: 1 })
  }

  async function handleAdvance() {
    const next = Math.min(assignment.progress + 20, 100)
    await api.post(`/assignments/${assignment.id}/progress`, {
      progress: next,
    })
    setAssignment({ ...assignment, progress: next })
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title={assignment.track.title}
        subtitle="Execução da atividade"
      />

      <Card className="p-6 space-y-4">
        <div className="text-sm opacity-70">
          Progresso
        </div>

        <div className="text-2xl font-semibold">
          {assignment.progress}%
        </div>

        {assignment.progress === 0 && (
          <button
            onClick={handleStart}
            className="
              rounded-lg bg-blue-600 px-4 py-2
              text-sm font-medium text-white
              hover:bg-blue-500 transition
            "
          >
            Iniciar atividade
          </button>
        )}

        {assignment.progress > 0 &&
          assignment.progress < 100 && (
            <button
              onClick={handleAdvance}
              className="
                rounded-lg bg-blue-600 px-4 py-2
                text-sm font-medium text-white
                hover:bg-blue-500 transition
              "
            >
              Avançar progresso
            </button>
          )}

        {assignment.progress >= 100 && (
          <div className="text-green-400 text-sm">
            Atividade concluída
          </div>
        )}
      </Card>
    </div>
  )
}
