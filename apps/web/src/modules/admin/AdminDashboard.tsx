import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import PageHeader from '../../components/base/PageHeader'
import Card from '../../components/base/Card'
import StatusBadge from '../../components/base/StatusBadge'
import EmptyState from '../../components/base/EmptyState'
import RiskTrendChart from '../../components/charts/RiskTrendChart'
import { getExecutiveReport } from '../../services/reports'

import type {
  ExecutiveSummary,
  PersonAtRisk,
  RiskLevel,
} from '/src/models/ExecutiveReport'

type KPIKey = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'

const previousSummary: Record<KPIKey, number> = {
  CRITICAL: 3,
  HIGH: 5,
  MEDIUM: 7,
  LOW: 9,
}

function riskTone(level: RiskLevel) {
  if (level === 'CRITICAL') return 'critical'
  if (level === 'HIGH') return 'warning'
  if (level === 'MEDIUM') return 'warning'
  return 'success'
}

function trend(current: number, previous: number) {
  const diff = current - previous
  if (diff > 0) return { icon: '↑', tone: 'warning', diff }
  if (diff < 0) return { icon: '↓', tone: 'success', diff }
  return { icon: '→', tone: 'success', diff: 0 }
}

export default function AdminDashboard() {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [summary, setSummary] =
    useState<ExecutiveSummary | null>(null)
  const [people, setPeople] = useState<PersonAtRisk[]>([])

  useEffect(() => {
    async function load() {
      try {
        const res = await getExecutiveReport('default')
        setSummary(res.data.summary)
        setPeople(res.data.peopleAtRisk ?? [])
      } catch (err) {
        console.error('[AdminDashboard]', err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  return (
    <div className="space-y-10">
      <PageHeader
        title="Dashboard Executivo"
        description="Visão geral de conformidade, risco e prioridades do escritório."
      />

      {loading && (
        <div className="text-sm opacity-60">
          Carregando indicadores…
        </div>
      )}

      {!loading && summary && (
        <>
          {/* KPIs */}
          <section className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {(
              [
                ['Crítico', 'CRITICAL'],
                ['Alto', 'HIGH'],
                ['Médio', 'MEDIUM'],
                ['Baixo', 'LOW'],
              ] as const
            ).map(([label, key]) => {
              const value = summary[key]
              const t = trend(value, previousSummary[key])
              const isCritical = key === 'CRITICAL'

              return (
                <Card
                  key={key}
                  variant={isCritical ? 'focus' : 'kpi'}
                  className={`text-center ${
                    isCritical ? 'md:col-span-2' : ''
                  }`}
                >
                  <div className="text-xs uppercase tracking-wide opacity-60">
                    {label}
                  </div>

                  <div className="mt-2 text-4xl font-semibold">
                    {value}
                  </div>

                  <div className="mt-3 flex items-center justify-center gap-2">
                    <StatusBadge
                      label={`${t.icon} ${Math.abs(t.diff)}`}
                      tone={t.tone as any}
                    />
                    <span className="text-xs opacity-60">
                      vs semana passada
                    </span>
                  </div>
                </Card>
              )
            })}
          </section>

          {/* CONTEÚDO CENTRAL */}
          <section className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <Card variant="panel" className="md:col-span-2">
              <h3 className="mb-4 font-medium">
                Evolução de risco (visão geral)
              </h3>
              <RiskTrendChart />
            </Card>

            <Card variant="panel">
              <h3 className="mb-4 font-medium">
                Pessoas que exigem atenção
              </h3>

              {people.length === 0 ? (
                <EmptyState
                  title="Nenhum risco identificado"
                  description="Todos os colaboradores estão dentro dos níveis aceitáveis de conformidade."
                />
              ) : (
                <div className="space-y-2">
                  {people.map(p => (
                    <div
                      key={p.personId}
                      className="flex items-center justify-between gap-4 rounded-lg px-3 py-2 hover:bg-white/5 transition"
                    >
                      <div>
                        <div className="font-medium">
                          {p.name}
                        </div>
                        {p.email && (
                          <div className="text-xs opacity-60">
                            {p.email}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <StatusBadge
                          label={p.risk}
                          tone={riskTone(p.risk)}
                        />

                        <button
                          onClick={() =>
                            navigate(`/admin/people/${p.personId}`)
                          }
                          className="rounded-md border px-3 py-1 text-xs font-medium opacity-70 hover:opacity-100"
                        >
                          Ver
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </section>
        </>
      )}
    </div>
  )
}
