import { useTracks } from '../../hooks/useTracks'
import { useProgress } from '../../hooks/useProgress'
import { useAudit } from '../../hooks/useAudit'

export default function ExecutiveDashboard() {
  const { list } = useTracks()
  const { get, isBlocked } = useProgress()
  const { list: audit } = useAudit()

  const tracks = list()

  const total = tracks.length
  const completed = tracks.filter(t => get(t.id) === 100).length
  const blocked = tracks.filter(t => isBlocked(t.id)).length

  const compliance =
    total === 0 ? 0 : Math.round((completed / total) * 100)

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
        Visão Executiva
      </h1>

      <div style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
        <Card title="Conformidade Geral" value={`${compliance}%`} />
        <Card title="Trilhas Bloqueadas" value={blocked} />
        <Card title="Total de Trilhas" value={total} />
      </div>

      <h2 style={{ fontSize: 18, marginBottom: 12 }}>
        Eventos Recentes
      </h2>

      {audit().slice(0, 5).map(e => (
        <p key={e.id} style={{ fontSize: 12 }}>
          {new Date(e.createdAt).toLocaleString()} — {e.message}
        </p>
      ))}
    </div>
  )
}

function Card({ title, value }: { title: string; value: any }) {
  return (
    <div
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: 8,
        padding: 16,
        minWidth: 180,
      }}
    >
      <p style={{ fontSize: 12, color: '#555' }}>{title}</p>
      <strong style={{ fontSize: 22 }}>{value}</strong>
    </div>
  )
}
