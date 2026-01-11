import { useParams } from 'react-router-dom'

import PageHeader from '../../components/base/PageHeader'
import Card from '../../components/base/Card'
import StatusBadge from '../../components/base/StatusBadge'

import { usePersonDetail } from '../../hooks/usePersonDetail'

export default function PersonDetail() {
  const { personId } = useParams<{ personId: string }>()
  const { person, assignments, audit, loading } =
    usePersonDetail(personId!)

  if (loading) {
    return (
      <div className="text-sm opacity-60">
        Carregando pessoa…
      </div>
    )
  }

  if (!person) {
    return (
      <div className="text-sm opacity-60">
        Pessoa não encontrada.
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title={person.name}
        description="Visão detalhada da pessoa"
      />

      <Card>
        <div className="space-y-2 text-sm">
          <div>Email: {person.email}</div>
          <div>
            Status:{' '}
            <StatusBadge
              label={person.active ? 'Ativo' : 'Inativo'}
              tone={person.active ? 'success' : 'warning'}
            />
          </div>
        </div>
      </Card>

      <Card>
        <div className="font-medium mb-2">
          Atribuições
        </div>
        {assignments.length === 0 ? (
          <div className="text-sm opacity-60">
            Nenhuma atribuição.
          </div>
        ) : (
          <ul className="text-sm space-y-1">
            {assignments.map(a => (
              <li key={a.id}>
                {a.track.title} — {a.status}
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card>
        <div className="font-medium mb-2">
          Auditoria
        </div>
        {audit.length === 0 ? (
          <div className="text-sm opacity-60">
            Nenhum evento.
          </div>
        ) : (
          <ul className="text-sm space-y-1">
            {audit.map(e => (
              <li key={e.id}>
                {e.action} —{' '}
                {new Date(e.createdAt).toLocaleString()}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}
