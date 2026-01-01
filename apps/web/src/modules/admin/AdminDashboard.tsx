import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import PageHeader from '../../components/base/PageHeader'
import Card from '../../components/base/Card'
import api from '../../services/api'

type OverviewData = {
  peopleAtRisk: { id: string; name: string }[]
  peopleAtRiskSoon: {
    id: string
    name: string
    daysInactive: number
  }[]
  correctiveOpenCount: number
}

export default function AdminDashboard() {
  const { systemState, me } = useAuth()
  const firstDay = systemState?.requiresOnboarding
  const assignmentsCount = me?.assignments?.length ?? 0

  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<OverviewData | null>(null)

  useEffect(() => {
    api
      .get('/admin/overview')
      .then(res => setData(res.data.data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-8">
      <PageHeader
        title="Painel administrativo"
        subtitle={
          firstDay
            ? 'Configure o essencial para iniciar.'
            : 'Visão geral do sistema.'
        }
      />

      {/* CTA EXECUTIVO */}
      {assignmentsCount > 0 && (
        <Card className="p-6 border border-blue-500/30 bg-blue-500/5">
          <div className="flex items-center justify-between gap-6">
            <div>
              <div className="text-sm font-medium text-blue-400">
                Atividade pendente
              </div>
              <div className="mt-1 text-slate-300">
                Você tem {assignmentsCount}{' '}
                {assignmentsCount === 1
                  ? 'atividade'
                  : 'atividades'} para executar agora.
              </div>
            </div>

            <Link
              to="/execucao"
              className="
                rounded-lg bg-blue-600 px-5 py-3
                text-sm font-medium text-white
                hover:bg-blue-500 transition
              "
            >
              Executar agora
            </Link>
          </div>
        </Card>
      )}

      {/* MÉTRICAS */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6">
          <div className="text-xs uppercase opacity-60">
            Pessoas em risco
          </div>
          <div className="mt-2 text-2xl font-semibold">
            {loading ? '…' : data?.peopleAtRisk.length ?? 0}
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-xs uppercase opacity-60">
            Risco iminente
          </div>
          <div className="mt-2 text-2xl font-semibold">
            {loading
              ? '…'
              : data?.peopleAtRiskSoon.length ?? 0}
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-xs uppercase opacity-60">
            Ações corretivas abertas
          </div>
          <div className="mt-2 text-2xl font-semibold">
            {loading
              ? '…'
              : data?.correctiveOpenCount ?? 0}
          </div>
        </Card>
      </div>
    </div>
  )
}
