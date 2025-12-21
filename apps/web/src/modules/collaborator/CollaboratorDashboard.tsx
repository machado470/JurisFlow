import { useEffect, useState } from 'react'
import api from '../../services/api'
import Card from '../../components/base/Card'

type Assignment = {
  id: string
  track: {
    title: string
  }
  progress: number
  personId?: string
}

export default function CollaboratorDashboard() {
  const [loading, setLoading] = useState(true)
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [submitting, setSubmitting] = useState<string | null>(null)

  async function load() {
    try {
      const res = await api.get('/me/assignments')
      setAssignments(res.data ?? [])
    } catch (err) {
      console.error('[Collaborator]', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function submitAssessment(a: Assignment) {
    try {
      setSubmitting(a.id)

      // MVP: score fixo (simulação realista)
      await api.post('/assessments', {
        assignmentId: a.id,
        personId: a.personId,
        score: 100,
        notes: 'Avaliação concluída com sucesso.',
      })

      await load()
    } catch (err) {
      console.error('[Assessment]', err)
      alert('Erro ao enviar avaliação.')
    } finally {
      setSubmitting(null)
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-semibold">
          Suas trilhas
        </h2>
        <p className="text-sm text-slate-500">
          Execute suas trilhas e conclua as avaliações.
        </p>
      </header>

      <Card>
        {loading ? (
          <div className="text-sm opacity-60">
            Carregando…
          </div>
        ) : assignments.length === 0 ? (
          <div className="text-sm opacity-60">
            Nenhuma trilha atribuída.
          </div>
        ) : (
          <div className="space-y-4">
            {assignments.map(a => (
              <div
                key={a.id}
                className="flex justify-between items-center"
              >
                <div>
                  <div className="font-medium">
                    {a.track.title}
                  </div>
                  <div className="text-xs text-slate-500">
                    Progresso: {a.progress}%
                  </div>
                </div>

                {a.progress < 100 ? (
                  <button
                    onClick={() =>
                      submitAssessment(a)
                    }
                    disabled={submitting === a.id}
                    className="px-3 py-1 text-xs rounded bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
                  >
                    Responder avaliação
                  </button>
                ) : (
                  <span className="text-xs text-emerald-600">
                    Concluída
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
