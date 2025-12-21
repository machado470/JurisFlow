import { useEffect, useState } from 'react'
import Card from '../../components/base/Card'
import PageHeader from '../../components/base/PageHeader'
import api from '../../services/api'

type TrackCompliance = {
  trackId: string
  title: string
  compliance: number
}

function barColor(value: number) {
  if (value >= 80) return 'bg-green-500'
  if (value >= 60) return 'bg-yellow-500'
  return 'bg-red-500'
}

export default function Tracks() {
  const [loading, setLoading] = useState(true)
  const [tracks, setTracks] = useState<TrackCompliance[]>([])

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/reports/executive')
        setTracks(res.data.data.trackCompliance ?? [])
      } catch (err) {
        console.error('[Tracks]', err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  return (
    <div className="space-y-8">
      <PageHeader
        title="Conformidade por Trilhas"
        description="Percentual médio de conformidade da equipe em cada trilha educacional."
      />

      <Card>
        {loading ? (
          <div className="text-sm opacity-60">
            Carregando dados…
          </div>
        ) : tracks.length === 0 ? (
          <div className="text-sm opacity-60">
            Nenhuma trilha com dados suficientes.
          </div>
        ) : (
          <div className="space-y-4">
            {tracks.map(t => (
              <div key={t.trackId}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">
                    {t.title}
                  </span>
                  <span className="opacity-70">
                    {t.compliance}%
                  </span>
                </div>

                <div className="h-3 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className={`h-full ${barColor(
                      t.compliance,
                    )}`}
                    style={{
                      width: `${t.compliance}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
