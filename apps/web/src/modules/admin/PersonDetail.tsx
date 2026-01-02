import { useNavigate, useParams } from 'react-router-dom'

import Card from '../../components/base/Card'
import PageHeader from '../../components/base/PageHeader'
import ProgressBar from '../../components/base/ProgressBar'
import StatusBadge from '../../components/base/StatusBadge'

import { usePersonDetail } from '../../hooks/usePersonDetail'

export default function PersonDetail() {
  const { personId } = useParams<{ personId: string }>()
  const navigate = useNavigate()

  const { person, assignments, loading, error } =
    usePersonDetail(personId!)

  if (loading) {
    return <div className="text-sm opacity-60">Carregando pessoa…</div>
  }

  if (error || !person) {
    return (
      <div className="text-sm text-red-500">
        Erro ao carregar pessoa.
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title={person.name}
        description="Detalhes e trilhas atribuídas"
      />

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-slate-400">Função</div>
            <div className="font-medium">{person.role}</div>
          </div>

          <StatusBadge
            label={person.active ? 'Ativo' : 'Inativo'}
            tone={person.active ? 'success' : 'warning'}
          />
        </div>
      </Card>

      <Card>
        <h3 className="text-sm font-semibold mb-4">
          Trilhas atribuídas
        </h3>

        {assignments.length === 0 ? (
          <div className="text-sm text-slate-400">
            Nenhuma trilha atribuída ainda.
          </div>
        ) : (
          <div className="space-y-4">
            {assignments.map(a => (
              <div
                key={a.id}
                className="p-4 rounded-lg border border-slate-200 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium">
                    {a.track.title}
                  </div>
                  <StatusBadge
                    label={`${a.progress}%`}
                    tone={
                      a.progress === 0
                        ? 'neutral'
                        : a.progress < 70
                        ? 'warning'
                        : 'success'
                    }
                  />
                </div>

                <ProgressBar value={a.progress} />

                {a.progress === 0 ? (
                  <button
                    onClick={() =>
                      navigate(`/execucao/assignment/${a.id}`)
                    }
                    className="text-blue-400 text-xs hover:underline"
                  >
                    Iniciar treinamento
                  </button>
                ) : (
                  <div className="text-xs text-slate-400">
                    Treinamento em andamento
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
