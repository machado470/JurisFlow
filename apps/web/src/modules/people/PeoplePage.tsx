import { useEffect, useState } from 'react'
import { usePeople } from './hooks/usePeople'
import { useNavigate } from 'react-router-dom'

export default function PeoplePage() {
  const { list, toggleActive } = usePeople()
  const navigate = useNavigate()

  const [people, setPeople] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const data = await list()
      setPeople(data)
      setLoading(false)
    }

    load()
  }, [])

  if (loading) {
    return <div className="p-6">Carregando pessoas...</div>
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Pessoas</h1>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th>Nome</th>
            <th>Email</th>
            <th>Perfil</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {people.map(p => (
            <tr
              key={p.id}
              className="border-b cursor-pointer hover:bg-gray-50"
              onClick={() => navigate(`/admin/people/${p.id}`)}
            >
              <td>{p.name}</td>
              <td>{p.email}</td>
              <td>{p.role}</td>
              <td>
                <button
                  onClick={e => {
                    e.stopPropagation()
                    toggleActive(p.id)
                  }}
                  className="underline"
                >
                  {p.active ? 'Ativo' : 'Inativo'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
