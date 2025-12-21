import PageHeader from '../../components/base/PageHeader'
import Card from '../../components/base/Card'
import StatusBadge from '../../components/base/StatusBadge'
import { Link } from 'react-router-dom'

type Track = {
  id: string
  name: string
  description: string
  peopleTotal: number
  peopleDelayed: number
}

const tracks: Track[] = [
  {
    id: 't1',
    name: 'LGPD',
    description:
      'Proteção de dados e conformidade legal.',
    peopleTotal: 8,
    peopleDelayed: 3,
  },
  {
    id: 't2',
    name: 'Compliance',
    description:
      'Boas práticas e normas internas.',
    peopleTotal: 5,
    peopleDelayed: 1,
  },
  {
    id: 't3',
    name: 'Governança',
    description:
      'Gestão e tomada de decisão.',
    peopleTotal: 4,
    peopleDelayed: 0,
  },
]

function trackTone(delayed: number) {
  if (delayed === 0) return 'success'
  if (delayed <= 2) return 'warning'
  return 'critical'
}

export default function Tracks() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Trilhas"
        description="Visão geral das trilhas e impacto no risco do escritório."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {tracks.map(track => (
          <Card key={track.id} className="space-y-4">
            <div>
              <div className="font-semibold">
                {track.name}
              </div>
              <div className="text-sm opacity-70">
                {track.description}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <StatusBadge
                label={
                  track.peopleDelayed === 0
                    ? 'Em conformidade'
                    : `${track.peopleDelayed} em atraso`
                }
                tone={trackTone(track.peopleDelayed)}
              />

              <Link
                to={`/admin/tracks/${track.id}`}
                className="text-sm text-blue-400 hover:underline"
              >
                Ver detalhes →
              </Link>
            </div>

            <div className="text-xs opacity-60">
              Pessoas: {track.peopleTotal}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
