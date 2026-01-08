import { createContext, useContext, useEffect, useState } from 'react'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'
import { getMe } from '../services/me'

type User = {
  id: string
  role: 'ADMIN' | 'COLLABORATOR'
  orgId: string
  personId: string | null
}

type SystemState = {
  requiresOnboarding?: boolean
  urgency?: string
  assignments: any[]
}

type AuthContextType = {
  user: User | null
  systemState: SystemState | null
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType,
)

export function AuthProvider({ children }: { children: any }) {
  const [user, setUser] = useState<User | null>(null)
  const [systemState, setSystemState] =
    useState<SystemState | null>(null)
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()

  async function loadMe() {
    try {
      const me = await getMe()
      setUser(me.user)
      setSystemState({
        assignments: me.assignments ?? [],
        urgency: me.urgency,
        requiresOnboarding: me.requiresOnboarding,
      })

      // �� REDIRECIONAMENTO AUTOMÁTICO
      if (me.user.role === 'ADMIN') {
        navigate('/admin', { replace: true })
      } else {
        navigate('/app', { replace: true })
      }
    } catch {
      logout()
    } finally {
      setLoading(false)
    }
  }

  async function login(email: string, password: string) {
    try {
      const res = await api.post('/auth/login', {
        email,
        password,
      })

      localStorage.setItem('token', res.data.token)
      await loadMe()
      return true
    } catch {
      return false
    }
  }

  function logout() {
    localStorage.removeItem('token')
    setUser(null)
    setSystemState(null)
    navigate('/login', { replace: true })
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      loadMe()
    } else {
      setLoading(false)
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        systemState,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
