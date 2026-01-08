import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import PageHeader from '../../components/base/PageHeader'
import Card from '../../components/base/Card'
import StatusBadge from '../../components/base/StatusBadge'

import {
  getTrack,
  updateTrack,
  publishTrack,
  archiveTrack,
  unassignPeopleFromTrack,
  type TrackDetail,
} from '../../services/tracks'

export default function TrackDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [track, setTrack] = useState<TrackDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  async function load() {
    if (!id) return
    setLoading(true)
    const data = await getTrack(id)
    setTrack(data)
    setTitle(data.title)
    setDescription(data.description ?? '')
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [id])

  async function handleSave() {
    if (!track || track.status !== 'DRAFT') return
    setSaving(true)
    await updateTrack(track.id, { title, description })
    await load()
    setSaving(false)
  }

  async function handlePublish() {
    if (!track) return
    await publishTrack(track.id)
    await load()
  }

  async function handleArchive() {
    if (!track) return
    await archiveTrack(track.id)
    await load()
  }

  async function handleUnassign(personId: string) {
    if (!track || track.status !== 'ACTIVE') return
    await unassignPeopleFromTrack({
      trackId: track.id,
      personIds: [personId],
    })
    await load()
  }

  if (loading || !track) {
    return (
      <div className="text-sm opacity-60">
        Carregando trilha…
      </div>
    )
  }

  const isDraft = track.status === 'DRAFT'
  const isActive = track.status === 'ACTIVE'

  return (
    <div className="space-y-8">
      <PageHeader
        title={track.title}
        description={`v${track.version}`}
        right={
          <button
            onClick={() => navigate('/admin/trilhas')}
            className="text-sm opacity-60 hover:opacity-100"
          >
            Voltar
          </button>
        }
      />

      {/* STATUS */}
      <Card className="flex items-center justify-between">
        <div>
          <div className="text-sm opacity-60">Status</div>
          <StatusBadge
            label={track.status}
            tone={
              track.status === 'ACTIVE'
                ? 'success'
                : track.status === 'DRAFT'
                ? 'warning'
                : 'neutral'
            }
          />
        </div>

        <div className="flex gap-2">
          {isDraft && (
            <button
              onClick={handlePublish}
              className="rounded bg-emerald-500/10 px-3 py-1 text-sm text-emerald-400"
            >
              Publicar
            </button>
          )}

          {isActive && (
            <button
              onClick={handleArchive}
              className="rounded bg-rose-500/10 px-3 py-1 text-sm text-rose-400"
            >
              Arquivar
            </button>
          )}
        </div>
      </Card>

      {/* EDIÇÃO */}
      <Card className="space-y-3">
        <div className="font-medium">
          Dados da trilha
        </div>

        <input
          disabled={!isDraft}
          className="w-full rounded bg-white/10 px-3 py-2 text-sm disabled:opacity-40"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <textarea
          disabled={!isDraft}
          className="w-full rounded bg-white/10 px-3 py-2 text-sm disabled:opacity-40"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />

        {isDraft && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded bg-blue-600 px-4 py-2 text-sm text-white disabled:opacity-50"
          >
            Salvar alterações
          </button>
        )}
      </Card>

      {/* ASSIGNMENTS */}
      <Card className="space-y-3">
        <div className="font-medium">
          Pessoas atribuídas
        </div>

        {track.assignments.length === 0 && (
          <div className="text-sm opacity-60">
            Nenhuma pessoa atribuída
          </div>
        )}

        {track.assignments.map(a => (
          <div
            key={a.id}
            className="flex items-center justify-between text-sm"
          >
            <div>
              {a.person?.name}
              <div className="text-xs opacity-50">
                Progresso: {a.progress}%
              </div>
            </div>

            {isActive && (
              <button
                onClick={() =>
                  handleUnassign(a.personId)
                }
                className="text-xs text-rose-400 hover:underline"
              >
                Remover
              </button>
            )}
          </div>
        ))}
      </Card>
    </div>
  )
}
