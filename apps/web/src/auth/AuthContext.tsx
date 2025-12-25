import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

type User = {
  id: string
  role: 'ADMIN' | 'COLLABORATOR'
  personId?: string
  orgId?: string
}

type AuthContextType = {
  token: string | null
  user: User | null
  login: (token: string, user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: any }) {
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const raw = localStorage.getItem('auth')
    if (raw) {
      const parsed = JSON.parse(raw)
      setToken(parsed.token)
      setUser(parsed.user)
    }
  }, [])

  function login(token: string, user: User) {
    localStorage.setItem(
      'auth',
      JSON.stringify({ token, user }),
    )
    setToken(token)
    setUser(user)
  }

  function logout() {
    localStorage.removeItem('auth')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{ token, user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error(
      'useAuth deve ser usado dentro de AuthProvider',
    )
  }
  return ctx
}
