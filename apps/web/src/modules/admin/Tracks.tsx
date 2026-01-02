import { useNavigate } from 'react-router-dom'
import Card from '../../components/base/Card'
import PageHeader from '../../components/base/PageHeader'
import { useTracks } from '../../hooks/useTracks'

export default function Tracks() {
  const navigate = useNavigate()
  const { tracks, loading } = useTracks()

  if (loading) {
    return <div className="text-sm opacity-60">Carregando trilhas…</div>
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Trilhas"
        description="Estrutura de governança da organização"
      />

      {tracks.length === 0 ? (
        <Card>
          <div className="text-sm text-slate-400">
            Nenhuma trilha criada ainda.
          </div>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {tracks.map(track => (
            <Card
              key={track.id}
              className="p-6 cursor-pointer hover:bg-slate-900"
              onClick={() =>
                navigate(`/admin/tracks/${track.id}`)
              }
            >
              <div className="font-medium">{track.title}</div>
              <div className="text-sm text-slate-400 mt-1">
                {track.description}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
