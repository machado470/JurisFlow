import { useEffect, useState } from 'react'

import Card from '../../components/base/Card'
import PageHeader from '../../components/base/PageHeader'
import StatusBadge from '../../components/base/StatusBadge'

import {
  getExecutiveReport,
  getExecutiveMetrics,
} from '../../services/reports'

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [report, setReport] = useState<any | null>(null)
  const [metrics, setMetrics] = useState<any | null>(null)

  useEffect(() => {
    let mounted = true

    async function load() {
      setLoading(true)
      try {
        const [r, m] = await Promise.all([
          getExecutiveReport(),
          getExecutiveMetrics(30),
        ])

        if (!mounted) return
        setReport(r)
        setMetrics(m)
      } catch {
        if (!mounted) return
        setReport(null)
        setMetrics(null)
      } finally {
        if (!mounted) return
        setLoading(false)
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [])

  if (loading) {
    return (
      <div className="text-sm opacity-60">
        Carregando painel executivo…
      </div>
    )
  }

  if (!report) {
    return (
      <Card>
        <div className="text-sm text-red-400">
          Não foi possível carregar o relatório executivo.
        </div>
      </Card>
    )
  }

  const sla = metrics?.correctiveSLA

  return (
    <div className="space-y-8">
      <PageHeader
        title="Visão Executiva"
        description="Estado atual e desempenho institucional"
      />

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <div className="text-sm opacity-60">Pessoas OK</div>
          <div className="text-2xl font-semibold">
            {report.peopleStats.OK}
          </div>
        </Card>

        <Card>
          <div className="text-sm opacity-60">Atenção</div>
          <div className="text-2xl font-semibold">
            {report.peopleStats.WARNING}
          </div>
        </Card>

        <Card>
          <div className="text-sm opacity-60">Críticos</div>
          <div className="text-2xl font-semibold text-rose-400">
            {report.peopleStats.CRITICAL}
          </div>
        </Card>

        <Card>
          <div className="text-sm opacity-60">Ações abertas</div>
          <div className="text-2xl font-semibold">
            {report.correctiveOpenCount}
          </div>
        </Card>
      </div>

      {sla && (
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm opacity-60">
                SLA médio (últimos {sla.windowDays} dias)
              </div>

              <div className="mt-2 flex gap-6">
                <div>
                  <div className="text-xs opacity-60">
                    Resolver ação
                  </div>
                  <div className="text-lg font-semibold">
                    {sla.avgResolveHours ?? '-'}h
                  </div>
                </div>

                <div>
                  <div className="text-xs opacity-60">
                    Fechar regime
                  </div>
                  <div className="text-lg font-semibold">
                    {sla.avgCloseHours ?? '-'}h
                  </div>
                </div>
              </div>
            </div>

            <StatusBadge
              label="SLA"
              tone={
                sla.avgResolveHours &&
                sla.avgResolveHours > 48
                  ? 'warning'
                  : 'success'
              }
            />
          </div>
        </Card>
      )}
    </div>
  )
}
