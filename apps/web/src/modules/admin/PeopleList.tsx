import { useEffect, useState } from 'react'
import PageHeader from '../../components/base/PageHeader'
import Card from '../../components/base/Card'
import api from '../../services/api'

type Person = {
  id: string
  name: string
  email?: string
  role: string
}

export default function PeopleList() {
  const [people, setPeople] = useState<Person[]>([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('COLLABORATOR')
  const [loading, setLoading] = useState(true)

  async function load() {
    const res = await api.get('/persons')
    setPeople(res.data.data)
    setLoading(false)
  }

  async function createPerson(e: React.FormEvent) {
    e.preventDefault()
    await api.post('/persons', { name, email, role })
    setName('')
    setEmail('')
    setRole('COLLABORATOR')
    load()
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <div className="space-y-8">
      <PageHeader
        title="Pessoas"
        description="Pessoas avaliadas no sistema."
      />

      <Card>
        <form onSubmit={createPerson} className="flex gap-4">
          <input
            className="bg-slate-800 rounded px-3 py-2 flex-1"
            placeholder="Nome"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />

          <input
            className="bg-slate-800 rounded px-3 py-2 flex-1"
            placeholder="Email (opcional)"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          <select
            className="bg-slate-800 rounded px-3 py-2"
            value={role}
            onChange={e => setRole(e.target.value)}
          >
            <option value="COLLABORATOR">Colaborador</option>
            <option value="ADMIN">Admin</option>
          </select>

          <button
            className="bg-blue-600 px-4 rounded font-medium"
            type="submit"
          >
            Criar
          </button>
        </form>
      </Card>

      <Card>
        {loading ? (
          <div className="opacity-60">Carregando…</div>
        ) : people.length === 0 ? (
          <div className="opacity-60">
            Nenhuma pessoa cadastrada.
          </div>
        ) : (
          <ul className="space-y-2">
            {people.map(p => (
              <li
                key={p.id}
                className="flex justify-between border-b border-slate-700 pb-2"
              >
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-sm opacity-70">
                    {p.role}
                  </div>
                  {p.email && (
                    <div className="text-sm opacity-50">
                      {p.email}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}
