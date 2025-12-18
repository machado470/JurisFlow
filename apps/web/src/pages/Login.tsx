import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import Card from '../components/ui/Card'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    try {
      await login(email, password)
      navigate('/admin')
    } catch {
      setError('Credenciais inválidas')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card title="JurisFlow">
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <input
            className="w-full p-2 rounded bg-black/30"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="w-full p-2 rounded bg-black/30"
            placeholder="Senha"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          {error && (
            <p className="text-sm text-red-400">
              {error}
            </p>
          )}

          <button className="w-full py-2 bg-blue-600 rounded">
            Entrar
          </button>
        </form>
      </Card>
    </div>
  )
}
