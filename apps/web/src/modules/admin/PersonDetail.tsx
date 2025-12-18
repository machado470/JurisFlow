import { useParams } from 'react-router-dom'
import Card from '../../components/ui/Card'
import { usePersonDetail } from '../../hooks/usePersonDetail'

export default function PersonDetail() {
  const { id } = useParams()
  const { person, assignments, audit, loading } =
    usePersonDetail(id)

  if (loading) {
    return (
      <Card title="Carregando pessoa...">
        <p className="text-sm opacity-70">
          Buscando dados completos.
        </p>
      </Card>
    )
  }

  if (!person) {
    return (
      <Card title="Pessoa não encontrada">
        <p className="text-sm opacity-70">
          Verifique o identificador.
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-2xl font-bold">
          {person.name}
        </h1>
        <p className="text-sm opacity-70">
          {person.email} · {person.role}
        </p>
      </div>

      {/* Trilhas */}
      <Card title="Trilhas atribuídas">
        {assignments.length === 0 && (
          <p className="text-sm opacity-70">
            Nenhuma trilha atribuída.
          </p>
        )}

        <div className="space-y-3">
          {assignments.map(a => (
            <div
              key={a.id}
              className="flex items-center justify-between"
            >
              <div>
                <p className="font-medium">
                  {a.track.title}
                </p>
                <p className="text-sm opacity-70">
                  Progresso: {a.progress}%
                </p>
              </div>

              <span className="text-sm font-semibold">
                Risco: {a.risk}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Auditoria */}
      <Card title="Eventos recentes">
        {audit.length === 0 && (
          <p className="text-sm opacity-70">
            Nenhum evento registrado.
          </p>
        )}

        <ul className="space-y-2">
          {audit.map(e => (
            <li key={e.id} className="text-sm">
              <strong>{e.action}</strong>
              {e.context && ` — ${e.context}`}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
