import { useEffect, useState } from 'react'
import PageHeader from '../../components/base/PageHeader'
import Card from '../../components/base/Card'
import {
  getTracks,
  createTrack,
  type Track,
} from '../../services/tracks'

export default function Tracks() {
  const [tracks, setTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [title, setTitle] = useState('')
  const [creating, setCreating] = useState(false)

  async function load() {
    setLoading(true)
    try {
      const data = await getTracks()
      setTracks(data)
    } catch {
      setError('Erro ao carregar trilhas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return

    try {
      setCreating(true)
      await createTrack({ title })
      setTitle('')
      await load()
    } catch {
      alert('Erro ao criar trilha')
    } finally {
      setCreating(false)
    }
  }

  return (
    <>
      <PageHeader
        title="Trilhas"
        description="Gerencie trilhas de treinamento"
      />

      <form onSubmit={handleCreate} className="mb-6 flex gap-2">
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Nome da trilha"
          className="flex-1 rounded bg-slate-800 px-3 py-2 text-white"
        />
        <button
          disabled={creating}
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          {creating ? 'Criando…' : 'Criar'}
        </button>
      </form>

      {loading && (
        <div className="text-slate-400">
          Carregando trilhas…
        </div>
      )}

      {error && (
        <div className="text-red-400">{error}</div>
      )}

      {!loading && tracks.length === 0 && (
        <div className="text-slate-400">
          Nenhuma trilha cadastrada.
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tracks.map(track => (
          <Card key={track.id} className="p-6">
            <h3 className="text-white font-medium">
              {track.title}
            </h3>

            <div className="mt-2 text-sm text-slate-400">
              Pessoas atribuídas: {track.assignmentsCount}
            </div>
          </Card>
        ))}
      </div>
    </>
  )
}
