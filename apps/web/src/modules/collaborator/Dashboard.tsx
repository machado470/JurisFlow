import { Link } from 'react-router-dom'

export default function CollaboratorDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        Área do Colaborador
      </h1>

      <p className="opacity-70 max-w-2xl">
        Aqui você acompanha suas avaliações, trilhas obrigatórias
        e ações pendentes.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to="/collaborator/assessment/1"
          className="rounded-lg border p-5 hover:bg-black/5 transition"
        >
          <div className="font-semibold">
            Avaliação pendente
          </div>
          <div className="text-sm opacity-70">
            Trilha: LGPD
          </div>
        </Link>

        <div className="rounded-lg border p-5 opacity-60">
          Nenhuma outra ação pendente.
        </div>
      </div>
    </div>
  )
}
