import Card from '../../components/ui/Card'
import { usePeople } from '../../hooks/usePeople'
import { Link } from 'react-router-dom'

export default function People() {
  const { people, loading } = usePeople()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Pessoas</h1>

      {loading && (
        <Card title="Carregando pessoas...">
          <p className="text-sm opacity-70">
            Buscando dados do sistema.
          </p>
        </Card>
      )}

      {!loading && people.length === 0 && (
        <Card title="Nenhuma pessoa cadastrada">
          <p className="text-sm opacity-70">
            Cadastre colaboradores para acompanhar progresso,
            risco individual e histórico de treinamentos.
          </p>
        </Card>
      )}

      {!loading && people.length > 0 && (
        <div className="grid gap-4">
          {people.map(person => (
            <Card key={person.id}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{person.name}</p>
                  <p className="text-sm opacity-70">
                    {person.email} · {person.role}
                  </p>
                </div>

                <Link
                  to={`/admin/people/${person.id}`}
                  className="text-sm text-blue-400 hover:underline"
                >
                  Ver detalhes →
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
