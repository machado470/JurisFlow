import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { usePersonRisk } from './hooks/usePersonRisk'

export default function PersonDetailPage() {
  const { personId } = useParams<{ personId: string }>()
  const navigate = useNavigate()

  const { load } = usePersonRisk(personId!)
  const [risk, setRisk] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let active = true

    async function fetchRisk() {
      try {
        const data = await load()
        if (active) setRisk(data)
      } catch {
        if (active) setError(true)
      } finally {
        if (active) setLoading(false)
      }
    }

    fetchRisk()

    return () => {
      active = false
    }
  }, [personId])

  if (loading) {
    return <div className="p-6">Carregando relatório...</div>
  }

  if (error || !risk) {
    return <div className="p-6">Erro ao carregar relatório</div>
  }

  return (
    <div className="p-6 space-y-4">
      <button
        onClick={() => navigate(-1)}
        className="underline"
      >
        ← Voltar
      </button>

      <h1 className="text-xl font-bold">{risk.name}</h1>
      <p>Perfil: {risk.role}</p>

      <div className="border rounded p-4 space-y-2">
        <p>
          <strong>Risco:</strong> {risk.risk}
        </p>
        <p>
          <strong>Pendências obrigatórias:</strong>{' '}
          {risk.incompleteMandatory}
        </p>
      </div>
    </div>
  )
}
