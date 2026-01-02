import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../services/api'
import Card from '../../components/base/Card'
import PageHeader from '../../components/base/PageHeader'
import SectionBase from '../../components/layout/SectionBase'
import ProgressBar from '../../components/base/ProgressBar'

type Assignment = {
  id: string
  progress: number
  track: {
    id: string
    title: string
  }
}

export default function AssignmentExecution() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [assignment, setAssignment] = useState<Assignment | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    // NÃO BUSCA /assignments/:id (inexistente)
    // Assume que o usuário veio da lista válida e o id é suficiente
    // Inicia execução diretamente
    api
      .post(`/assignments/${id}/start`)
      .then(() => {
        if (mounted) {
          setAssignment(prev =>
            prev
              ? prev
              : ({
                  id: id!,
                  progress: 0,
                  track: { id: '', title: 'Atividade' },
                } as Assignment),
          )
        }
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [id])

  function updateProgress(value: number) {
    api
      .patch(`/assignments/${id}/progress`, {
        progress: value,
      })
      .then(() => {
        setAssignment(a =>
          a ? { ...a, progress: value } : a,
        )
      })
  }

  function complete() {
    api.post(`/assignments/${id}/complete`).then(() => {
      navigate('/collaborator')
    })
  }

  if (loading || !assignment) {
    return (
      <SectionBase>
        <PageHeader title="Execução" />
        <p className="text-slate-400 mt-6">
          Preparando atividade…
        </p>
      </SectionBase>
    )
  }

  return (
    <SectionBase>
      <PageHeader
        title={assignment.track.title}
        description="Execute a atividade e atualize seu progresso."
      />

      <Card>
        <ProgressBar value={assignment.progress} />

        <div className="flex gap-3 mt-6">
          <button
            className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700"
            onClick={() =>
              updateProgress(
                Math.min(assignment.progress + 10, 100),
              )
            }
          >
            Avançar
          </button>

          <button
            className="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500"
            onClick={complete}
          >
            Concluir
          </button>
        </div>
      </Card>
    </SectionBase>
  )
}
