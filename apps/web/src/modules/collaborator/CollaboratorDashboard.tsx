import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/base/Card'
import PageHeader from '../../components/base/PageHeader'
import SectionBase from '../../components/layout/SectionBase'
import AssignmentList from '../../components/base/AssignmentList'
import api from '../../services/api'

type Assignment = {
  id: string
  progress: number
  track: {
    id: string
    title: string
  }
}

type Me = {
  name?: string
  assignments?: Assignment[]
  urgency?: 'NORMAL' | 'WARNING' | 'CRITICAL'
}

export default function CollaboratorDashboard() {
  const navigate = useNavigate()
  const [me, setMe] = useState<Me | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    api
      .get('/me')
      .then(res => {
        if (!mounted) return
        setMe(res.data)
      })
      .finally(() => mounted && setLoading(false))
    return () => {
      mounted = false
    }
  }, [])

  const assignments = me?.assignments ?? []

  const primaryAssignment = useMemo(
    () => assignments.find(a => a.progress < 100),
    [assignments],
  )

  const hasAssignments = assignments.length > 0

  if (loading) {
    return (
      <SectionBase>
        <div className="max-w-7xl mx-auto px-6 py-24 text-slate-400">
          Carregando painel…
        </div>
      </SectionBase>
    )
  }

  return (
    <SectionBase>
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-10">
        <PageHeader
          title={`Olá${me?.name ? `, ${me.name}` : ''}`}
          subtitle="Este é o seu painel de execução."
        />

        {/* ESTADO SEM TAREFAS */}
        {!hasAssignments && (
          <Card className="p-10 bg-slate-900/80 border border-white/10">
            <span className="inline-block mb-4 px-4 py-1.5 text-xs uppercase rounded-full border border-emerald-400/20 text-emerald-300 bg-emerald-500/5">
              Tudo em dia
            </span>

            <h2 className="text-2xl font-semibold text-white">
              Nenhuma tarefa pendente
            </h2>

            <p className="mt-4 text-slate-300 max-w-xl">
              No momento, não há atividades atribuídas a você.
              Quando houver, elas aparecerão aqui com prioridade
              clara.
            </p>
          </Card>
        )}

        {/* ESTADO COM TAREFAS */}
        {hasAssignments && (
          <div className="grid gap-8 md:grid-cols-3">
            {/* FOCO OPERACIONAL */}
            <Card className="md:col-span-2 p-10 bg-slate-900/80 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-6">
                Prioridade agora
              </h2>

              {primaryAssignment ? (
                <div className="space-y-4">
                  <div className="text-slate-300">
                    Continue a atividade:
                    <span className="ml-2 font-medium text-white">
                      {primaryAssignment.track.title}
                    </span>
                  </div>

                  <div className="text-sm text-slate-400">
                    Progresso atual:{' '}
                    {primaryAssignment.progress}%
                  </div>

                  <button
                    onClick={() =>
                      navigate(
                        `/collaborator/assignment/${primaryAssignment.id}`,
                      )
                    }
                    className="mt-4 inline-flex px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-500 transition"
                  >
                    Continuar agora
                  </button>
                </div>
              ) : (
                <div className="text-slate-400">
                  Todas as atividades estão concluídas.
                </div>
              )}

              <div className="mt-10">
                <AssignmentList assignments={assignments} />
              </div>
            </Card>

            {/* STATUS */}
            <Card className="p-8 bg-slate-900/70 border border-white/10">
              <div className="text-xs uppercase tracking-wider text-slate-400">
                Situação atual
              </div>

              <div className="mt-4 text-2xl font-semibold text-white">
                {me?.urgency === 'CRITICAL'
                  ? 'Atenção imediata'
                  : me?.urgency === 'WARNING'
                  ? 'Alerta'
                  : 'Normal'}
              </div>

              <p className="mt-4 text-sm text-slate-300">
                {me?.urgency === 'CRITICAL'
                  ? 'Você está com atividades paradas há tempo excessivo.'
                  : me?.urgency === 'WARNING'
                  ? 'Há risco de atraso se não houver avanço.'
                  : 'Execução dentro do esperado.'}
              </p>
            </Card>
          </div>
        )}
      </div>
    </SectionBase>
  )
}
