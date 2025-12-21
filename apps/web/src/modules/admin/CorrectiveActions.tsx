import { useEffect, useState } from 'react'
import Card from '../../components/base/Card'
import PageHeader from '../../components/base/PageHeader'
import StatusBadge from '../../components/base/StatusBadge'
import api from '../../services/api'

type CorrectiveAction = {
  id: string
  reason: string
  status: 'OPEN' | 'IN_PROGRESS' | 'DONE'
  person: {
    name: string
  }
}

function statusTone(status: CorrectiveAction['status']) {
  if (status === 'DONE') return 'success'
  if (status === 'IN_PROGRESS') return 'warning'
  return 'critical'
}

export default function CorrectiveActions() {
  const [loading, setLoading] = useState(true)
  const [actions, setActions] = useState<CorrectiveAction[]>([])
  const [resolving, setResolving] = useState<string | null>(null)

  async function load() {
    try {
      const res = await api.get('/corrective-actions')
      setActions(res.data ?? [])
    } catch (err) {
      console.error('[CorrectiveActions]', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function resolveAction(id: string) {
    try {
      setResolving(id)
      await api.patch(`/corrective-actions/${id}/resolve`)
      await load()
    } catch (err) {
      console.error('[ResolveAction]', err)
      alert('Erro ao resolver ação.')
    } finally {
      setResolving(null)
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Ações Corretivas"
        description="Acompanhamento e resolução de ações corretivas."
      />

      <Card>
        {loading ? (
          <div className="text-sm opacity-60">
            Carregando ações…
          </div>
        ) : actions.length === 0 ? (
          <div className="text-sm opacity-60">
            Nenhuma ação corretiva registrada.
          </div>
        ) : (
          <div className="space-y-3">
            {actions.map(a => (
              <div
                key={a.id}
                className="flex items-center justify-between"
              >
                <div>
                  <div className="font-medium">
                    {a.reason}
                  </div>
                  <div className="text-xs opacity-70">
                    {a.person.name}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <StatusBadge
                    label={a.status}
                    tone={statusTone(a.status)}
                  />

                  {a.status !== 'DONE' && (
                    <button
                      onClick={() => resolveAction(a.id)}
                      disabled={resolving === a.id}
                      className="text-xs px-3 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
                    >
                      Resolver
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
