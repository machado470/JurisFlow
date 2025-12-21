import { useParams, useNavigate } from 'react-router-dom'
import Card from '../../components/base/Card'

export default function PersonDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  // 🔒 Mock controlado (depois vem da API)
  const person = {
    id,
    name: 'Ana Silva',
    email: 'ana@empresa.com',
    status: 'CRITICO',
    compliance: 42,
    pending: 3,
  }

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <header className="space-y-1">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-slate-500 hover:text-slate-700"
        >
          ← Voltar
        </button>

        <h1 className="text-2xl font-semibold">
          {person.name}
        </h1>
        <p className="text-sm text-slate-500">
          {person.email}
        </p>
      </header>

      {/* Indicadores */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <p className="text-sm text-slate-500">
            Status
          </p>
          <strong className="text-xl text-red-600">
            Crítico
          </strong>
        </Card>

        <Card>
          <p className="text-sm text-slate-500">
            Conformidade
          </p>
          <strong className="text-xl">
            {person.compliance}%
          </strong>
        </Card>

        <Card>
          <p className="text-sm text-slate-500">
            Pendências
          </p>
          <strong className="text-xl">
            {person.pending}
          </strong>
        </Card>
      </section>

      {/* Diagnóstico */}
      <Card>
        <h3 className="text-lg font-medium mb-2">
          Diagnóstico
        </h3>

        <p className="text-sm text-slate-600 leading-relaxed">
          Esta pessoa apresenta risco crítico devido a baixa
          taxa de conformidade nas trilhas obrigatórias e
          pendências não resolvidas. A recomendação é
          intervenção imediata com ação corretiva formal.
        </p>
      </Card>

      {/* Ação */}
      <Card>
        <h3 className="text-lg font-medium mb-4">
          Ação corretiva
        </h3>

        <button className="w-full py-3 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700">
          Registrar ação corretiva
        </button>
      </Card>
    </div>
  )
}
