import Card from '../../components/base/Card'
import PageHeader from '../../components/base/PageHeader'
import SectionBase from '../../components/layout/SectionBase'
import StatusBadge from '../../components/base/StatusBadge'
import { useExecutiveDashboard } from '../../hooks/useExecutiveDashboard'

function Kpi({
  label,
  value,
  tone = 'neutral',
}: {
  label: string
  value: number
  tone?: 'neutral' | 'success' | 'warning' | 'danger'
}) {
  const toneMap = {
    neutral: 'text-white',
    success: 'text-emerald-400',
    warning: 'text-amber-400',
    danger: 'text-rose-400',
  }

  return (
    <Card>
      <p className="text-sm text-slate-400">{label}</p>
      <p className={`mt-2 text-3xl font-semibold ${toneMap[tone]}`}>
        {value}
      </p>
    </Card>
  )
}

export default function AdminDashboard() {
  const {
    loading,
    data,
    peopleAtRisk,
    peopleAtRiskSoon,
    correctiveOpenCount,
  } = useExecutiveDashboard()

  if (loading) {
    return (
      <SectionBase>
        <PageHeader
          title="Dashboard Executivo"
          description="Visão consolidada de risco e ações corretivas."
        />
        <p className="mt-6 text-slate-400">
          Carregando indicadores…
        </p>
      </SectionBase>
    )
  }

  if (!data) {
    return (
      <SectionBase>
        <PageHeader
          title="Dashboard Executivo"
          description="Visão consolidada de risco e ações corretivas."
        />
        <p className="mt-6 text-slate-400">
          Não foi possível carregar os dados agora.
        </p>
      </SectionBase>
    )
  }

  const healthy =
    peopleAtRisk.length === 0 &&
    peopleAtRiskSoon.length === 0 &&
    correctiveOpenCount === 0

  return (
    <SectionBase>
      <PageHeader
        title="Dashboard Executivo"
        description="Risco humano, conformidade e ações ativas em tempo real."
      />

      {/* ESTADO GERAL */}
      <div className="mt-6">
        {healthy ? (
          <div className="flex items-center gap-2 text-emerald-400">
            <span>●</span>
            <span className="text-sm">
              Organização em conformidade. Nenhum risco ativo.
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-amber-400">
            <span>●</span>
            <span className="text-sm">
              Atenção necessária. Existem riscos ou ações pendentes.
            </span>
          </div>
        )}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Kpi
          label="Pessoas em risco"
          value={peopleAtRisk.length}
          tone={
            peopleAtRisk.length === 0 ? 'success' : 'danger'
          }
        />
        <Kpi
          label="Risco em breve"
          value={peopleAtRiskSoon.length}
          tone={
            peopleAtRiskSoon.length === 0
              ? 'success'
              : 'warning'
          }
        />
        <Kpi
          label="Ações corretivas abertas"
          value={correctiveOpenCount}
          tone={
            correctiveOpenCount === 0
              ? 'success'
              : 'warning'
          }
        />
      </div>

      {/* PESSOAS EM RISCO */}
      <section className="mt-12">
        <h2 className="text-lg font-semibold mb-4">
          Pessoas em risco
        </h2>

        {peopleAtRisk.length === 0 ? (
          <p className="text-slate-400">
            Nenhuma pessoa em risco no momento.
          </p>
        ) : (
          <div className="space-y-3">
            {peopleAtRisk.map(p => (
              <Card key={p.id}>
                <div className="flex items-center justify-between">
                  <span>{p.name}</span>
                  <StatusBadge
                    label={p.risk}
                    tone={p.risk.toLowerCase()}
                  />
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* RISCO EM BREVE */}
      <section className="mt-12">
        <h2 className="text-lg font-semibold mb-4">
          Risco em breve
        </h2>

        {peopleAtRiskSoon.length === 0 ? (
          <p className="text-slate-400">
            Nenhum risco iminente identificado.
          </p>
        ) : (
          <div className="space-y-3">
            {peopleAtRiskSoon.map(p => (
              <Card key={p.id}>
                <div className="flex items-center justify-between">
                  <span>{p.name}</span>
                  <StatusBadge
                    label={p.risk}
                    tone={p.risk.toLowerCase()}
                  />
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </SectionBase>
  )
}
