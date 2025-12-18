import Card from '../../components/ui/Card'
import { useAudit } from '../../hooks/useAudit'

export default function Audit() {
  const { events, loading } = useAudit()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        Auditoria
      </h1>

      {loading && (
        <Card title="Carregando auditoria...">
          <p className="text-sm opacity-70">
            Buscando eventos do sistema.
          </p>
        </Card>
      )}

      {!loading && events.length === 0 && (
        <Card title="Nenhum evento registrado">
          <p className="text-sm opacity-70">
            Aqui serão exibidos eventos críticos do sistema,
            como riscos, avaliações e ações administrativas.
          </p>
        </Card>
      )}

      {!loading && events.length > 0 && (
        <Card title="Eventos recentes">
          <ul className="space-y-3">
            {events.map(event => (
              <li
                key={event.id}
                className="border-b border-white/5 pb-2"
              >
                <p className="text-sm font-medium">
                  {event.action}
                </p>

                {event.context && (
                  <p className="text-sm opacity-70">
                    {event.context}
                  </p>
                )}

                <p className="text-xs opacity-50">
                  {event.person?.name
                    ? `Pessoa: ${event.person.name} · `
                    : ''}
                  {new Date(event.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  )
}
