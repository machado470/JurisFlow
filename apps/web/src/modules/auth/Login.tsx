import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import AuthLayout from './AuthLayout'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const ok = await login(email, password)

    if (ok) {
      navigate('/admin', { replace: true })
    } else {
      setError('Credenciais inválidas')
    }

    setLoading(false)
  }

  return (
    <AuthLayout>
      <h2 className="text-2xl font-semibold text-white mb-6">
        Acessar sistema
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="w-full rounded-lg bg-white/5 px-4 py-3 text-sm text-white outline-none ring-1 ring-white/10 focus:ring-blue-500"
        />

        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Senha"
          required
          className="w-full rounded-lg bg-white/5 px-4 py-3 text-sm text-white outline-none ring-1 ring-white/10 focus:ring-blue-500"
        />

        {error && (
          <div className="text-sm text-red-400">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="
            w-full rounded-lg
            bg-blue-600 px-4 py-3
            text-sm font-medium text-white
            hover:bg-blue-500
            transition
            disabled:opacity-60
          "
        >
          {loading ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </AuthLayout>
  )
}
