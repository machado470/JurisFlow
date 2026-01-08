import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import PageHeader from '../../components/base/PageHeader'
import Card from '../../components/base/Card'
import StatusBadge from '../../components/base/StatusBadge'
import SectionBase from '../../components/layout/SectionBase'

import { getPerson } from '../../services/persons'
import {
  startAssignment,
  completeAssignment,
} from '../../services/assignments'
import {
  getCorrectiveActionsByPerson,
  resolveCorrectiveAction,
} from '../../services/correctiveActions'
import { getPersonTimeline } from '../../services/timeline'

type Assignment = {
  id: string
  progress: number
  risk: string
  track: {
    title: string
  }
}

export default function PersonDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [person, setPerson] = useState<any | null>(null)
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [correctives, setCorrectives] = useState<any[]>([])
  const [timeline, setTimeline] = useState<any[]>([])

  async function load() {
    if (!id) return
    setLoading(true)

    const [p, c, t] = await Promise.all([
      getPerson(id),
      getCorrectiveActionsByPerson(id),
      getPersonTimeline(id),
    ])

    setPerson(p)
    setAssignments(p.assignments ?? [])
    setCorrectives(c)
    setTimeline(t)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [id])

  if (loading || !person) {
    return (
      <SectionBase>
        <p className="text-sm opacity-60">
          Carregando pessoa…
        </p>
      </SectionBase>
    )
  }

  return (
    <SectionBase>
      <PageHeader
        title={person.name}
        description={person.role}
      />

      {/* ESTADO OPERACIONAL */}
      <Card className="mb-6">
        <div className="flex items-center justify-between">
          <span className="text-sm opacity-60">
            Estado operacional
          </span>

          <StatusBadge
            label={person.operationalState}
            tone={
              person.operationalState === 'NORMAL'
                ? 'success'
                : person.operationalState === 'RESTRICTED'
                ? 'warning'
                : 'critical'
            }
          />
        </div>
      </Card>

      {/* ASSIGNMENTS */}
      <div className="space-y-4 mb-8">
        <h3 className="text-sm font-semibold opacity-70">
          Trilhas ativas
        </h3>

        {assignments.length === 0 && (
          <p className="text-sm opacity-50">
            Nenhuma trilha ativa.
          </p>
        )}

        {assignments.map(a => (
          <Card key={a.id}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">
                {a.track.title}
              </span>

              <span className="text-xs opacity-60">
                {a.progress}%
              </span>
            </div>

            <div className="w-full h-2 bg-white/10 rounded overflow-hidden mb-3">
              <div
                className="h-2 bg-blue-400"
                style={{ width: `${a.progress}%` }}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {a.progress === 0 && (
                <button
                  onClick={async () => {
                    await startAssignment(a.id)
                    load()
                  }}
                  className="text-xs px-3 py-1 rounded bg-slate-800 hover:bg-slate-700"
                >
                  Iniciar
                </button>
              )}

              {a.progress > 0 && a.progress < 100 && (
                <>
                  <button
                    onClick={async () => {
                      await completeAssignment(a.id)
                      load()
                    }}
                    className="text-xs px-3 py-1 rounded bg-emerald-600/20 text-emerald-400"
                  >
                    Concluir
                  </button>

                  <button
                    onClick={() =>
                      navigate(
                        `/admin/avaliacoes?assignmentId=${a.id}`,
                      )
                    }
                    className="text-xs px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-500"
                  >
                    Avaliar
                  </button>
                </>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* AÇÕES CORRETIVAS */}
      <div className="space-y-4 mb-8">
        <h3 className="text-sm font-semibold opacity-70">
          Ações corretivas
        </h3>

        {correctives.length === 0 && (
          <p className="text-sm opacity-50">
            Nenhuma ação corretiva aberta.
          </p>
        )}

        {correctives.map(c => (
          <Card key={c.id}>
            <div className="flex items-center justify-between">
              <span>{c.reason}</span>

              {c.status === 'OPEN' && (
                <button
                  onClick={async () => {
                    await resolveCorrectiveAction(c.id)
                    load()
                  }}
                  className="text-xs px-3 py-1 rounded bg-amber-600/20 text-amber-400"
                >
                  Resolver
                </button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* TIMELINE */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold opacity-70">
          Linha do tempo
        </h3>

        {timeline.map(e => (
          <Card key={e.id}>
            <div className="text-xs opacity-60 mb-1">
              {new Date(e.createdAt).toLocaleString()}
            </div>
            <div className="text-sm">
              {e.description ?? e.title}
            </div>
          </Card>
        ))}
      </div>
    </SectionBase>
  )
}
