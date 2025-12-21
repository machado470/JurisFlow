import PageHeader from '../../components/base/PageHeader'
import Card from '../../components/base/Card'

export default function Reports() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Relatórios"
        description="Visões consolidadas para tomada de decisão e auditoria."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-medium mb-2">
            Relatório Executivo
          </h3>
          <p className="text-sm opacity-70 mb-4">
            Indicadores gerais de risco, conformidade e ações
            corretivas.
          </p>

          <div className="h-32 rounded bg-white/5 border border-white/10 flex items-center justify-center opacity-60">
            (Em breve)
          </div>
        </Card>

        <Card>
          <h3 className="font-medium mb-2">
            Relatório de Auditoria
          </h3>
          <p className="text-sm opacity-70 mb-4">
            Histórico detalhado de eventos, avaliações e ações.
          </p>

          <div className="h-32 rounded bg-white/5 border border-white/10 flex items-center justify-center opacity-60">
            (Em breve)
          </div>
        </Card>
      </div>
    </div>
  )
}
