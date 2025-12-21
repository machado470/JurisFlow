import { useParams, Link } from 'react-router-dom'
import PageHeader from '../../components/base/PageHeader'
import Card from '../../components/base/Card'
import UserAvatar from '../../components/UserAvatar'

type PersonTrack = {
  id: string
  name: string
  role: string
  progress: number
  status: 'EM ANDAMENTO' | 'CONCLUÍDA'
}

type Track = {
  id: string
  name: string
  description: string
  people: PersonTrack[]
}

const mockTrack: Track = {
  id: 't1',
  name: 'LGPD',
  description:
    'Treinamento obrigatório sobre proteção de dados e conformidade legal.',
  people: [
    {
      id: '1',
      name: 'João Silva',
      role: 'Advogado',
      progress: 60,
      status: 'EM ANDAMENTO',
    },
    {
      id: '2',
      name: 'Maria Santos',
      role: 'Assistente Jurídica',
      progress: 100,
      status: 'CONCLUÍDA',
    },
  ],
}

function statusColor(status: PersonTrack['status']) {
  return status === 'CONCLUÍDA'
    ? 'text-green-500'
    : 'text-blue-500'
}

export default function TrackDetail() {
  const { id } = useParams()
  const track = mockTrack

  return (
    <div className="space-y-8">
      <PageHeader
        title={track.name}
        description={track.description}
        right={
          <Link
            to="/admin/tracks"
            className="text-sm text-blue-400 hover:underline"
          >
            ← Voltar
          </Link>
        }
      />

      {/* Pessoas */}
      <Card>
        <h2 className="font-semibold mb-4">
          Pessoas nesta trilha
        </h2>

        <div className="space-y-4">
          {track.people.map(person => (
            <div
              key={person.id}
              className="rounded-lg border px-4 py-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <UserAvatar name={person.name} />

                  <div className="leading-tight">
                    <div className="font-medium">
                      {person.name}
                    </div>
                    <div className="text-sm opacity-70">
                      {person.role}
                    </div>
                  </div>
                </div>

                <span
                  className={`text-sm font-medium ${statusColor(
                    person.status
                  )}`}
                >
                  {person.status}
                </span>
              </div>

              <div className="mt-2 h-2 rounded bg-black/10 overflow-hidden">
                <div
                  className="h-full bg-blue-500"
                  style={{ width: `${person.progress}%` }}
                />
              </div>

              <div className="mt-1 text-xs opacity-60">
                Progresso: {person.progress}%
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
