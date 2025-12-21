import Card from '../../components/base/Card'
import { useExecutiveDashboard } from '../../hooks/useExecutiveDashboard'
import { useNavigate } from 'react-router-dom'

export default function AdminDashboard() {
  const { stats } = useExecutiveDashboard()
  const navigate = useNavigate()

  return (
    <div className="space-y-10">
      {/* Cabeçalho executivo */}
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">
          Visão Executiva
        </h1>
        <p className="text-sm text-slate-500 max-w-2xl">
          Panorama atual de risco humano e conformidade do
          escritório. Priorize ações corretivas antes que
          riscos se tornem passivos jurídicos.
        </p>
      </header>

      {/* KPIs principais */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <p className="text-sm text-slate-500">
            Pessoas monitoradas
          </p>
          <strong className="text-4xl font-semibold">
            {stats.people}
          </strong>
        </Card>

        <Card>
          <p className="text-sm text-slate-500">
            Risco crítico
          </p>
          <strong className="text-4xl font-semibold text-red-600">
            {stats.critical}
          </strong>
        </Card>

        <Card>
          <p className="text-sm text-slate-500">
            Em atenção
          </p>
          <strong className="text-4xl font-semibold text-amber-600">
            {stats.attention}
          </strong>
        </Card>

        <Card>
          <p className="text-sm text-slate-500">
            Conformidade média
          </p>
          <strong className="text-4xl font-semibold text-emerald-600">
            {stats.complianceAvg}%
          </strong>
        </Card>
      </section>

      {/* Bloco estratégico */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-medium mb-2">
            Leitura executiva
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Há colaboradores classificados como risco crítico
            e em atenção. A recomendação é priorizar ações
            corretivas imediatas para reduzir exposição e
            elevar a conformidade geral da equipe.
          </p>
        </Card>

        <Card>
          <h3 className="text-lg font-medium mb-4">
            Próxima ação recomendada
          </h3>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/admin/people')}
              className="w-full py-3 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700"
            >
              Ver pessoas em risco
            </button>

            <button
              onClick={() => navigate('/admin/tracks')}
              className="w-full py-3 rounded-lg border text-slate-700 hover:bg-slate-50"
            >
              Revisar trilhas críticas
            </button>
          </div>
        </Card>
      </section>
    </div>
  )
}
