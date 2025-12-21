import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Card from '../../components/base/Card'
import PageHeader from '../../components/base/PageHeader'
import StatusBadge from '../../components/base/StatusBadge'
import api from '../../services/api'

type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

type Assignment = {
  id: string
  track: { title: string }
  progress: number
  risk: RiskLevel
}

type TimelineItem = {
  type: string
  label: string
  description?: string
  date: string
}

function riskTone(risk: RiskLevel) {
  if (risk === 'CRITICAL') return 'critical'
  if (risk === 'HIGH' || risk === 'MEDIUM')
    return 'warning'
  return 'success'
}

export default function PersonDetail() {
  const { id } = useParams<{ id: string }>()
  const [assignments, setAssignments] =
    useState<Assignment[]>([])
  const [timeline, setTimeline] =
    useState<TimelineItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [a, t] = await Promise.all([
          api.get(`/persons/${id}/assignments`),
          api.get(`/persons/${id}/timeline`),
        ])

        setAssignments(a.data ?? [])
        setTimeline(t.data ?? [])
      } catch (err) {
        console.error('[PersonDetail]', err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [id])

  return (
    <div className="space-y-10">
      <PageHeader
        title="Detalhe da Pessoa"
        description="Progresso, risco e histórico completo."
      />

      {/* Trilhas */}
      <Card>
        <h3 className="font-medium mb-4">
          Trilhas atribuídas
        </h3>

        {assignments.length === 0 ? (
          <div className="text-sm opacity-60">
            Nenhuma trilha atribuída.
          </div>
        ) : (
          <div className="space-y-3">
            {assignments.map(a => (
              <div
                key={a.id}
                className="flex justify-between"
              >
                <div>
                  <div className="font-medium">
                    {a.track.title}
                  </div>
                  <div className="text-xs opacity-70">
                    Progresso: {a.progress}%
                  </div>
                </div>

                <StatusBadge
                  label={a.risk}
                  tone={riskTone(a.risk)}
                />
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Timeline */}
      <Card>
        <h3 className="font-medium mb-4">
          Linha do tempo
        </h3>

        {loading ? (
          <div className="text-sm opacity-60">
            Carregando…
          </div>
        ) : timeline.length === 0 ? (
          <div className="text-sm opacity-60">
            Nenhum evento registrado.
          </div>
        ) : (
          <div className="space-y-4">
            {timeline.map((i, idx) => (
              <div key={idx}>
                <div className="text-xs opacity-60">
                  {new Date(i.date).toLocaleString()}
                </div>
                <div className="font-medium">
                  {i.label}
                </div>
                {i.description && (
                  <div className="text-sm opacity-70">
                    {i.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
