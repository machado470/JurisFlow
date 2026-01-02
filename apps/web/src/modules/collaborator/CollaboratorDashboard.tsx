import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'

export default function CollaboratorDashboard() {
  const { systemState } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-2xl font-semibold">
        Execução de Atividades
      </h1>

      {systemState?.assignments?.length === 0 && (
        <div className="mt-6 p-4 rounded bg-emerald-500/10 text-emerald-400">
          Nenhuma atividade pendente. Bom trabalho.
        </div>
      )}

      {systemState?.assignments?.map(assignment => (
        <div
          key={assignment.id}
          className="mt-6 p-4 rounded bg-slate-800 border border-white/10"
        >
          <h2 className="font-semibold">
            {assignment.track.title}
          </h2>

          <p className="text-slate-400 mt-2">
            Progresso: {assignment.progress}%
          </p>

          <button
            onClick={() =>
              navigate(`/execucao/assignment/${assignment.id}`)
            }
            className="mt-4 px-4 py-2 rounded bg-blue-600 hover:bg-blue-500"
          >
            Executar atividade
          </button>
        </div>
      ))}
    </div>
  )
}
