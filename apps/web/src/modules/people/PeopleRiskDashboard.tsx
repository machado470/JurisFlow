import { useEffect, useState } from 'react'
import { usePeopleRisk } from './hooks/usePeopleRisk'

const COLORS: Record<string, string> = {
  OK: 'text-green-600',
  ATENÇÃO: 'text-yellow-600',
  CRÍTICO: 'text-red-600',
}

export default function PeopleRiskDashboard() {
  const { list } = usePeopleRisk()
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    list().then(data => {
      setRows(data)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return <div>Carregando risco…</div>
  }

  if (rows.length === 0) {
    return <div>Nenhum risco encontrado.</div>
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Risco da Equipe</h1>

      <table className="w-full border text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="p-2">Nome</th>
            <th className="p-2">Perfil</th>
            <th className="p-2">Risco</th>
            <th className="p-2">Pendências</th>
          </tr>
        </thead>

        <tbody>
          {rows.map(r => (
            <tr key={r.personId} className="border-b">
              <td className="p-2">{r.name}</td>
              <td className="p-2">{r.role}</td>
              <td className={`p-2 font-bold ${COLORS[r.risk]}`}>
                {r.risk}
              </td>
              <td className="p-2">{r.incompleteMandatory}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
