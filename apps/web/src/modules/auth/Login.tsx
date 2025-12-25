import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'
import { useAuth } from '../../auth/AuthContext'
import Card from '../../components/base/Card'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await api.post('/auth/login', {
        email,
        password,
      })

      const { token, user } = res.data.data
      login(token, user)

      navigate(user.role === 'ADMIN' ? '/admin' : '/collaborator')
    } catch {
      setError('Não foi possível autenticar. Verifique seus dados.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <Card className="w-full max-w-md">
        <h1 className="text-xl font-semibold tracking-tight">
          Acesso ao JurisFlow
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          Informe suas credenciais para continuar.
        </p>

        {error && (
          <div className="mt-4 rounded border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4"
        >
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="
              w-full
              rounded-lg
              bg-slate-800/60
              px-3
              py-2
              text-sm
              outline-none
              ring-1
              ring-white/10
              focus:ring-blue-500/40
            "
          />

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="
              w-full
              rounded-lg
              bg-slate-800/60
              px-3
              py-2
              text-sm
              outline-none
              ring-1
              ring-white/10
              focus:ring-blue-500/40
            "
          />

          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              rounded-lg
              bg-blue-600
              py-2
              text-sm
              font-medium
              text-white
              hover:bg-blue-500
              transition
              disabled:opacity-50
            "
          >
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
      </Card>
    </div>
  )
}
