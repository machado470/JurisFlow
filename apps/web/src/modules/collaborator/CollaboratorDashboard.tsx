import { useNavigate } from 'react-router-dom'
import Card from '../../components/base/Card'
import StatusBadge from '../../components/base/StatusBadge'
import { useMyAssignments } from '../../hooks/useMyAssignments'

function riskTone(risk?: string) {
  if (risk === 'CRITICAL') return 'critical'
  if (risk === 'HIGH') return 'warning'
  if (risk === 'MEDIUM') return 'warning'
  return 'success'
}

export default function CollaboratorDashboard() {
  const { assignments, loading, error } =
    useMyAssignments()

  const navigate = useNavigate()
  const nextAssignment = assignments[0]

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Meu treinamento
        </h1>
        <p className="text-sm text-slate-400">
          Acompanhe sua situação atual e conclua suas
          atividades obrigatórias.
        </p>
      </div>

      {nextAssignment && (
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400">
                Status atual
              </div>
              <div className="mt-2">
                <StatusBadge
                  label={nextAssignment.risk}
                  tone={riskTone(nextAssignment.risk)}
                />
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs text-slate-400">
                Progresso
              </div>
              <div className="mt-1 text-2xl font-semibold">
                {nextAssignment.progress}%
              </div>
            </div>
          </div>
        </Card>
      )}

      <Card>
        <h2 className="font-medium mb-3">
          Próxima ação obrigatória
        </h2>

        {loading ? (
          <div className="text-sm text-slate-400">
            Carregando suas trilhas…
          </div>
        ) : error ? (
          <div className="text-sm text-red-400">
            {error}
          </div>
        ) : !nextAssignment ? (
          <div className="text-sm text-slate-400">
            Nenhuma atividade pendente no momento.
          </div>
        ) : (
          <div className="flex items-center justify-between gap-6">
            <div>
              <div className="font-medium">
                {nextAssignment.track.title}
              </div>
              <div className="text-xs text-slate-400">
                Esta atividade é obrigatória para manter
                conformidade.
              </div>
            </div>

            <button
              onClick={() =>
                navigate(
                  `/collaborator/assignment/${nextAssignment.id}`,
                )
              }
              className="
                rounded-lg
                bg-blue-600
                px-4
                py-2
                text-sm
                font-medium
                hover:bg-blue-500
                transition
              "
            >
              Iniciar atividade
            </button>
          </div>
        )}
      </Card>

      <Card>
        <h2 className="font-medium mb-3">
          Minhas trilhas
        </h2>

        {assignments.length === 0 ? (
          <div className="text-sm text-slate-400">
            Você não possui trilhas atribuídas.
          </div>
        ) : (
          <div className="space-y-2">
            {assignments.map(a => (
              <div
                key={a.id}
                className="flex items-center justify-between text-sm"
              >
                <div>{a.track.title}</div>
                <div className="text-slate-400">
                  {a.progress}%
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
