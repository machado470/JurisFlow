import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import PageHeader from '../../components/base/PageHeader'
import Card from '../../components/base/Card'
import api from '../../services/api'

type PersonTrack = {
  personId: string
  name: string
  role: string
  progress: number
}

type Track = {
  id: string
  title: string
  description?: string
  people: PersonTrack[]
}

export default function TrackDetail() {
  const { id } = useParams()
  const [track, setTrack] = useState<Track | null>(null)

  useEffect(() => {
    async function load() {
      const res = await api.get(`/tracks/${id}`)
      setTrack(res.data)
    }

    load()
  }, [id])

  if (!track) {
    return <div className="opacity-60">Carregando…</div>
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title={track.title}
        description={track.description}
        right={
          <Link
            to="/admin/tracks"
            className="text-sm text-blue-500"
          >
            ← Voltar
          </Link>
        }
      />

      <Card>
        {track.people.length === 0 ? (
          <div className="text-sm opacity-60">
            Nenhuma pessoa atribuída.
          </div>
        ) : (
          <div className="space-y-3">
            {track.people.map(p => (
              <div
                key={p.personId}
                className="flex justify-between text-sm"
              >
                <div>
                  <div className="font-medium">
                    {p.name}
                  </div>
                  <div className="opacity-60">
                    {p.role}
                  </div>
                </div>
                <div>{p.progress}%</div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
