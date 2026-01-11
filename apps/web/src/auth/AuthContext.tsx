import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import type { ReactNode } from 'react'
import api from '../services/api'
import { getMe } from '../services/me'

/**
 * 🔐 Tipos alinhados ao backend
 */

export type UserRole = 'ADMIN' | 'COLLABORATOR'

export type User = {
  id: string
  email: string
  role: UserRole
  orgId: string
  personId: string | null
}

export type OperationalState =
  | 'NORMAL'
  | 'RESTRICTED'
  | 'SUSPENDED'

export type OperationalStatus = {
  state: OperationalState
  reason?: string
}

export type AssignmentStatus =
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'

export type Assignment = {
  id: string
  progress: number
  status: AssignmentStatus
  track: {
    id: string
    title: string
  }
}

export type SystemState = {
  operational: OperationalStatus
  assignments: Assignment[]
}

/**
 * 🧠 Contexto
 */
type AuthContextType = {
  user: User | null
  systemState: SystemState | null
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  refresh: () => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType,
)

/**
 * 🧩 Provider
 */
export function AuthProvider({
  children,
}: {
  children: ReactNode
}) {
  const [user, setUser] = useState<User | null>(null)
  const [systemState, setSystemState] =
    useState<SystemState | null>(null)
  const [loading, setLoading] = useState(true)

  /**
   * 🔁 Recarrega estado autenticado
   */
  async function refresh() {
    setLoading(true)

    try {
      const data = await getMe()

      setUser(data.user ?? null)
      setSystemState({
        operational: data.operational,
        assignments: data.assignments ?? [],
      })
    } catch {
      setUser(null)
      setSystemState(null)
      localStorage.removeItem('token')
    } finally {
      setLoading(false)
    }
  }

  /**
   * 🔐 Login
   */
  async function login(
    email: string,
    password: string,
  ): Promise<boolean> {
    try {
      const { data } = await api.post('/auth/login', {
        email,
        password,
      })

      if (!data?.token) return false

      localStorage.setItem('token', data.token)
      await refresh()

      return true
    } catch {
      return false
    }
  }

  /**
   * 🚪 Logout
   */
  function logout() {
    localStorage.removeItem('token')
    setUser(null)
    setSystemState(null)
    window.location.href = '/login'
  }

  useEffect(() => {
    if (localStorage.getItem('token')) {
      refresh()
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
        refresh,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

/**
 * 🪝 Hook público
 */
export function useAuth() {
  return useContext(AuthContext)
}
