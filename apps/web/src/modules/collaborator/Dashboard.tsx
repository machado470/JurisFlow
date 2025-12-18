import { Link } from 'react-router-dom'
import Card from '../../components/ui/Card'
import { useMyAssignments } from '../../hooks/useMyAssignments'

export default function CollaboratorDashboard() {
  const { assignments, loading } = useMyAssignments()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        Meu Treinamento
      </h1>

      {loading && (
        <Card title="Carregando trilhas...">
          <p className="opacity-70">
            Buscando seus treinamentos.
          </p>
        </Card>
      )}

      {!loading && assignments.length === 0 && (
        <Card title="Nenhuma trilha atribuída">
          <p className="opacity-70">
            Você ainda não possui treinamentos ativos.
          </p>
        </Card>
      )}

      {!loading && assignments.length > 0 && (
        <div className="grid gap-4">
          {assignments.map(a => (
            <Card key={a.id}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    {a.track.title}
                  </p>
                  <p className="text-sm opacity-70">
                    Progresso: {a.progress}%
                  </p>
                </div>

                <Link
                  to={`/collaborator/assessment/${a.id}`}
                  className="text-sm text-blue-400 hover:underline"
                >
                  Avaliar →
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
