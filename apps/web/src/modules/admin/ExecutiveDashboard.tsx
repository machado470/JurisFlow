import Card from '../../components/ui/Card'
import KpiCard from '../../components/ui/KpiCard'
import ProgressRow from '../../components/ui/ProgressRow'
import RiskEvolutionCard from '../../components/ui/RiskEvolutionCard'
import TeamDistributionCard from '../../components/ui/TeamDistributionCard'

export default function ExecutiveDashboard() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">
        Visão Executiva
      </h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <KpiCard label="Pessoas monitoradas" value={42} />
        <KpiCard label="Em risco" value={7} status="danger" />
        <KpiCard
          label="Conformidade média"
          value={86}
          unit="%"
          status="success"
        />
      </div>

      <Card title="Conformidade por Trilhas">
        <ProgressRow label="Contratos" value={62} status="warning" />
        <ProgressRow label="Compliance" value={48} status="danger" />
        <ProgressRow label="Propriedade Intelectual" value={91} status="success" />
        <ProgressRow label="Responsabilidade Civil" value={75} status="success" />
        <ProgressRow label="Trabalhista" value={58} status="warning" />
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RiskEvolutionCard />
        <TeamDistributionCard />
      </div>
    </div>
  )
}
