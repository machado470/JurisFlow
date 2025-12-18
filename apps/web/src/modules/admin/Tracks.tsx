import { useNavigate } from 'react-router-dom'
import Card from '../../components/ui/Card'
import ProgressRow from '../../components/ui/ProgressRow'
import { tracks } from '../../mocks/tracks'

export default function Tracks() {
  const navigate = useNavigate()

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">
        Trilhas
      </h1>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {tracks.map(track => (
          <Card
            key={track.id}
            title={track.name}
            className="cursor-pointer hover:opacity-90 transition"
            actions={
              <button
                onClick={() => navigate(`/admin/tracks/${track.id}`)}
                className="text-xs opacity-60 hover:opacity-100"
              >
                Ver detalhes →
              </button>
            }
          >
            <p className="text-sm opacity-70">
              {track.description}
            </p>

            <div className="pt-4">
              <ProgressRow
                label="Conformidade"
                value={track.conformity}
                status={track.risk}
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
