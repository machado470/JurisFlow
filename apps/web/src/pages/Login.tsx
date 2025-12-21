import { useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    // mock temporário
    login('fake-token', {
      id: '1',
      role: 'ADMIN',
    })

    navigate('/admin')
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 border rounded-lg p-6"
      >
        <h1 className="text-xl font-bold text-center">
          JurisFlow
        </h1>

        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Entrar
        </button>
      </form>
    </div>
  )
}
