import { useParams, Link, useNavigate } from 'react-router-dom'
import { markResolved } from '../../utils/demoRisk'

export default function PersonDetail() {
  const { personId } = useParams()
  const navigate = useNavigate()

  function resolve() {
    if (!personId) return
    markResolved(personId)
    navigate('/admin/executive')
  }

  return (
    <div className="space-y-6">
      <Link to="/admin/executive" className="text-sm opacity-70">
        ← Voltar ao dashboard
      </Link>

      <h1 className="text-2xl font-semibold">
        Colaborador #{personId}
      </h1>

      <div className="border rounded-lg p-4 bg-amber-50">
        <div className="font-semibold text-amber-700">
          Risco identificado
        </div>
        <div className="text-sm text-amber-700">
          Este colaborador possui ações corretivas pendentes.
        </div>
      </div>

      <div className="border rounded-lg p-4">
        <h2 className="font-semibold mb-2">Ação recomendada</h2>
        <p className="text-sm opacity-80">
          Revisar trilhas obrigatórias e concluir treinamentos pendentes.
        </p>

        <button
          className="mt-4 px-4 py-2 rounded bg-black text-white"
          onClick={resolve}
        >
          Marcar ação como concluída
        </button>
      </div>
    </div>
  )
}
