import { useParams } from 'react-router-dom'
import { peopleData } from '../../data/demo'
import { calculateRisk, riskColor } from '../../lib/risk'

export default function PersonRiskDetail() {
  const { name } = useParams()

  const person = peopleData.find(
    p => p.name === decodeURIComponent(name || '')
  )

  if (!person) {
    return <div className="text-red-500">Pessoa não encontrada</div>
  }

  const risk = calculateRisk(person.score)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{person.name}</h1>
        <span
          className={`inline-block mt-2 px-3 py-1 rounded font-bold ${riskColor(
            risk
          )}`}
        >
          {risk}
        </span>
      </div>

      <div className="border border-zinc-800 rounded p-4 space-y-2">
        <p>📉 Score de risco: {person.score}%</p>
        <p>📚 Trilhas pendentes: {person.pendingTracks}</p>
      </div>

      {risk === 'ALTO' && (
        <button className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 font-bold">
          Atribuir ação corretiva
        </button>
      )}
    </div>
  )
}
