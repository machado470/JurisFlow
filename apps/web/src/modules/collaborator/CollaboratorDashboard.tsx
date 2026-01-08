import { useEffect, useState } from 'react'

import PageHeader from '../../components/base/PageHeader'
import Card from '../../components/base/Card'
import StatusBadge from '../../components/base/StatusBadge'

import CollaboratorShell from '../../layouts/CollaboratorShell'

import { getMe } from '../../services/me'
import { startAssignment } from '../../services/assignments'

export default function CollaboratorDashboard() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any | null>(null)

  async function load() {
    setLoading(true)
    const res = await getMe()
    setData(res)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  if (loading || !data) {
    return (
      <CollaboratorShell>
        <p className="text-sm opacity-60">
          Carregando…
        </p>
      </CollaboratorShell>
    )
  }

  const { assignments, urgency } = data

  return (
    <CollaboratorShell>
      <PageHeader
        title="Meu painel"
        description="Suas trilhas e estado atual"
      />

      {/* ESTADO */}
      <Card className="mb-6">
        <div className="flex items-center justify-between">
          <span className="text-sm opacity-60">
            Estado operacional
          </span>
          <StatusBadge
            label={urgency}
            tone={
              urgency === 'NORMAL'
                ? 'success'
                : urgency === 'RESTRICTED'
                ? 'warning'
                : 'critical'
            }
          />
        </div>
      </Card>

      {/* TRILHAS */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold opacity-70">
          Trilhas ativas
        </h3>

        {assignments.length === 0 && (
          <p className="text-sm opacity-50">
            Nenhuma trilha atribuída.
          </p>
        )}

        {assignments.map((a: any) => (
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

            {urgency === 'NORMAL' && a.progress === 0 && (
              <button
                onClick={async () => {
                  await startAssignment(a.id)
                  load()
                }}
                className="text-xs px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-500"
              >
                Iniciar trilha
              </button>
            )}

            {urgency !== 'NORMAL' && (
              <p className="text-xs text-amber-400">
                Ação bloqueada devido ao seu estado operacional
              </p>
            )}
          </Card>
        ))}
      </div>
    </CollaboratorShell>
  )
}
