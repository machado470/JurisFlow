import { createContext, useContext, useEffect, useState } from 'react'
import api from '../services/api'

type User = {
  id: string
  role: 'ADMIN' | 'COLLABORATOR'
  orgId: string
  personId: string | null
}

type SystemState = {
  requiresOnboarding: boolean
  urgency: string
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

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false)
      return
    }

    api
      .get('/me')
      .then(res => {
        setUser({
          id: res.data.id,
          role: res.data.role,
          orgId: res.data.orgId,
          personId: res.data.personId,
        })
        setSystemState({
          requiresOnboarding: res.data.requiresOnboarding,
          urgency: res.data.urgency,
          assignments: res.data.assignments,
        })
      })
      .finally(() => setLoading(false))
  }, [])

  async function login(email: string, password: string) {
    try {
      const res = await api.post('/auth/login', {
        email,
        password,
      })

      localStorage.setItem('token', res.data.token)

      setUser(res.data.user)
      setLoading(true)

      const me = await api.get('/me')
      setSystemState({
        requiresOnboarding: me.data.requiresOnboarding,
        urgency: me.data.urgency,
        assignments: me.data.assignments,
      })

      setLoading(false)
      return true
    } catch {
      setLoading(false)
      return false
    }
  }

  function logout() {
    localStorage.removeItem('token')
    setUser(null)
    setSystemState(null)
  }

  return (
    <AuthContext.Provider
      value={{ user, systemState, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
