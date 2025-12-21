import Card from '../../components/base/Card'
import { useNavigate } from 'react-router-dom'

export default function AdminDashboard() {
  const navigate = useNavigate()

  return (
    <div className="space-y-10">
      {/* Cabeçalho */}
      <header className="space-y-1">
        <h1 className="text-3xl font-semibold">
          Painel Administrativo
        </h1>
        <p className="text-sm text-slate-500 max-w-2xl">
          Acompanhe a situação do escritório e execute ações
          estratégicas com base em dados reais do sistema.
        </p>
      </header>

      {/* Estado do sistema */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <h3 className="text-lg font-medium mb-2">
            Situação geral
          </h3>
          <p className="text-sm text-slate-600">
            Os indicadores de risco, conformidade e auditoria
            são calculados automaticamente a partir das
            avaliações realizadas.
          </p>
        </Card>

        <Card>
          <h3 className="text-lg font-medium mb-2">
            Próxima ação
          </h3>
          <p className="text-sm text-slate-600 mb-4">
            Revise os relatórios executivos para identificar
            pessoas e áreas que exigem atenção imediata.
          </p>

          <button
            onClick={() => navigate('/admin/reports')}
            className="w-full py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Abrir relatórios
          </button>
        </Card>

        <Card>
          <h3 className="text-lg font-medium mb-2">
            Estrutura educacional
          </h3>
          <p className="text-sm text-slate-600 mb-4">
            Gerencie trilhas, conteúdos e avaliações da equipe.
          </p>

          <button
            onClick={() => navigate('/admin/tracks')}
            className="w-full py-2 rounded border hover:bg-slate-50"
          >
            Gerenciar trilhas
          </button>
        </Card>
      </section>
    </div>
  )
}
