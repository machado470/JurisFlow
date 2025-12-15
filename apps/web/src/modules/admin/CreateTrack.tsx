import { useState } from 'react'
import { useTracks } from '../../hooks/useTracks'

export default function CreateTrack() {
  const { add } = useTracks()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [maxAttempts, setMaxAttempts] = useState(3)
  const [certificateEnabled, setCertificateEnabled] = useState(true)

  function submit(e: React.FormEvent) {
    e.preventDefault()

    if (!title.trim()) return alert('Título obrigatório')

    add({
      id: crypto.randomUUID(),
      title,
      description,
      rule: {
        maxAttempts,
        certificateEnabled,
      },
    })

    setTitle('')
    setDescription('')
    setMaxAttempts(3)
    setCertificateEnabled(true)
  }

  return (
    <form
      onSubmit={submit}
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: 8,
        padding: 16,
        marginBottom: 24,
      }}
    >
      <h2 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>
        Criar nova trilha
      </h2>

      <input
        placeholder="Título da trilha"
        value={title}
        onChange={e => setTitle(e.target.value)}
        style={{ width: '100%', marginBottom: 8 }}
      />

      <textarea
        placeholder="Descrição"
        value={description}
        onChange={e => setDescription(e.target.value)}
        style={{ width: '100%', marginBottom: 8 }}
      />

      <input
        type="number"
        min={1}
        value={maxAttempts}
        onChange={e => setMaxAttempts(Number(e.target.value))}
        style={{ width: '100%', marginBottom: 8 }}
      />

      <label style={{ display: 'block', marginBottom: 12 }}>
        <input
          type="checkbox"
          checked={certificateEnabled}
          onChange={e => setCertificateEnabled(e.target.checked)}
        />{' '}
        Emitir certificado
      </label>

      <button
        type="submit"
        style={{
          padding: '6px 12px',
          background: '#111',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Criar trilha
      </button>
    </form>
  )
}
