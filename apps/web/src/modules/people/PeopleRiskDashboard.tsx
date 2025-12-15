import { useEffect, useState } from 'react'
import { usePeopleRisk } from './hooks/usePeopleRisk'
import { useTheme } from '../../theme/ThemeProvider'

const COLORS: Record<string, string> = {
  OK: 'text-green-600',
  ATENÇÃO: 'text-yellow-600',
  CRÍTICO: 'text-red-600',
}

export default function PeopleRiskDashboard() {
  const { list } = usePeopleRisk()
  const { styles } = useTheme()

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

  return (
    <div className="space-y-6">
      <h1 className={`text-2xl font-bold ${styles.text}`}>
        Risco da Equipe
      </h1>

      <div className={`border rounded-lg ${styles.card} ${styles.border}`}>
        {rows.length === 0 ? (
          <div className="p-6 text-sm opacity-70">
            Nenhum risco encontrado.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className={`border-b ${styles.border}`}>
                <th className="p-3 text-left">Nome</th>
                <th className="p-3 text-left">Perfil</th>
                <th className="p-3 text-left">Risco</th>
                <th className="p-3 text-left">Pendências</th>
              </tr>
            </thead>

            <tbody>
              {rows.map(r => (
                <tr key={r.personId} className={`border-b ${styles.border}`}>
                  <td className="p-3">{r.name}</td>
                  <td className="p-3">{r.role}</td>
                  <td className={`p-3 font-bold ${COLORS[r.risk]}`}>
                    {r.risk}
                  </td>
                  <td className="p-3">{r.incompleteMandatory}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
