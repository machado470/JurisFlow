import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageHeader from '../../components/base/PageHeader'
import Card from '../../components/base/Card'
import {
  getTrack,
  assignPeopleToTrack,
  type Track,
} from '../../services/tracks'
import { usePersons } from '../../hooks/usePersons'

export default function TrackDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [track, setTrack] = useState<Track | null>(null)
  const [selected, setSelected] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    data: people,
    loading: loadingPeople,
  } = usePersons()

  useEffect(() => {
    if (!id) return
    getTrack(id).then(setTrack)
  }, [id])

  function toggle(personId: string) {
    setSelected(prev =>
      prev.includes(personId)
        ? prev.filter(id => id !== personId)
        : [...prev, personId],
    )
  }

  async function handleAssign() {
    if (!id || selected.length === 0) return

    try {
      setSaving(true)
      setError(null)
      await assignPeopleToTrack({
        trackId: id,
        personIds: selected,
      })
      setSelected([])
      const updated = await getTrack(id)
      setTrack(updated)
    } catch {
      setError('Erro ao atribuir pessoas à trilha')
    } finally {
      setSaving(false)
    }
  }

  if (!track) {
    return (
      <div className="text-sm text-slate-400">
        Carregando trilha…
      </div>
    )
  }

  return (
    <div className="space-y-10">
      <PageHeader
        title={track.title}
        description={track.description}
        right={
          <button
            onClick={() => navigate('/admin/tracks')}
            className="text-sm opacity-70 hover:opacity-100"
          >
            Voltar
          </button>
        }
      />

      <Card className="space-y-4">
        <div className="text-sm text-slate-400">
          Pessoas atribuídas: {track.assignmentsCount}
        </div>

        {loadingPeople ? (
          <div className="text-sm text-slate-400">
            Carregando pessoas…
          </div>
        ) : (
          <div className="space-y-2">
            {people.map(p => (
              <label
                key={p.id}
                className="flex items-center gap-2 text-sm"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(p.id)}
                  onChange={() => toggle(p.id)}
                />
                <span>{p.name}</span>
              </label>
            ))}
          </div>
        )}

        {error && (
          <div className="text-sm text-red-400">{error}</div>
        )}

        <button
          onClick={handleAssign}
          disabled={saving || selected.length === 0}
          className="mt-4 rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
        >
          {saving ? 'Salvando…' : 'Atribuir pessoas'}
        </button>
      </Card>
    </div>
  )
}
