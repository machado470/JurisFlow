import { useNavigate } from 'react-router-dom'
import Card from '../../components/base/Card'
import {
  usePeopleRisk,
  PersonInput,
} from '../../hooks/usePeopleRisk'

const DATA: PersonInput[] = [
  {
    id: '1',
    name: 'Ana Silva',
    email: 'ana@empresa.com',
    compliance: 42,
    pending: 3,
  },
  {
    id: '2',
    name: 'Carlos Souza',
    email: 'carlos@empresa.com',
    compliance: 68,
    pending: 1,
  },
  {
    id: '3',
    name: 'Marina Lopes',
    email: 'marina@empresa.com',
    compliance: 100,
    pending: 0,
  },
]

function StatusBadge({ status }: { status: any }) {
  const map = {
    APTO: 'bg-emerald-100 text-emerald-700',
    ATENCAO: 'bg-amber-100 text-amber-700',
    CRITICO: 'bg-red-100 text-red-700',
  }

  const label = {
    APTO: 'Apto',
    ATENCAO: 'Em atenção',
    CRITICO: 'Crítico',
  }

  return (
    <span
      className={`text-xs font-medium px-2 py-1 rounded ${map[status]}`}
    >
      {label[status]}
    </span>
  )
}

export default function People() {
  const navigate = useNavigate()
  const people = usePeopleRisk(DATA)

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            Pessoas
          </h1>
          <p className="text-sm text-slate-500">
            Monitoramento de risco humano
          </p>
        </div>

        <button className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-500">
          Adicionar pessoa
        </button>
      </header>

      <Card>
        <table className="w-full text-sm">
          <thead className="text-left text-slate-500">
            <tr>
              <th>Status</th>
              <th>Pessoa</th>
              <th>Conformidade</th>
              <th>Pendências</th>
              <th></th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {people.map(p => (
              <tr
                key={p.id}
                onClick={() => navigate(`/admin/people/${p.id}`)}
                className="h-14 cursor-pointer hover:bg-slate-50 transition"
              >
                <td>
                  <StatusBadge status={p.status} />
                </td>

                <td>
                  <div className="font-medium">
                    {p.name}
                  </div>
                  <div className="text-xs text-slate-500">
                    {p.email}
                  </div>
                </td>

                <td>{p.compliance}%</td>
                <td>{p.pending}</td>

                <td className="text-right text-slate-400">
                  Ver detalhes →
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
