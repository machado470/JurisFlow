import { usePeople } from './hooks/usePeople'
import { useTracks } from '../tracks/useTracks'
import { useAssignments } from './hooks/useAssignments'
import { useState } from 'react'

export default function AssignTracks() {
  const { list: people } = usePeople()
  const { list: tracks } = useTracks()
  const { assign } = useAssignments()

  const [personId, setPersonId] = useState('')
  const [trackId, setTrackId] = useState('')
  const [mandatory, setMandatory] = useState(true)

  function submit() {
    if (!personId || !trackId) return

    assign({
      personId,
      trackId,
      mandatory
    })

    alert('Trilha atribuída')
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Atribuir Trilha</h1>

      <select
        className="border p-2 w-full"
        onChange={e => setPersonId(e.target.value)}
      >
        <option value="">Pessoa</option>
        {people().map(p => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      <select
        className="border p-2 w-full"
        onChange={e => setTrackId(e.target.value)}
      >
        <option value="">Trilha</option>
        {tracks().map(t => (
          <option key={t.id} value={t.id}>
            {t.title}
          </option>
        ))}
      </select>

      <label className="flex gap-2 items-center">
        <input
          type="checkbox"
          checked={mandatory}
          onChange={e => setMandatory(e.target.checked)}
        />
        Obrigatória
      </label>

      <button
        onClick={submit}
        className="px-4 py-2 bg-black text-white"
      >
        Atribuir
      </button>
    </div>
  )
}
