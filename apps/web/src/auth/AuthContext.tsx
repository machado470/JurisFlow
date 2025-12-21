import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

type User = {
  id: string
  email: string
  role: 'ADMIN' | 'COLLABORATOR'
}

type AuthContextType = {
  user: User | null
  token: string | null
  ready: boolean
  login: (data: { user: User; token: string }) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('auth')

    if (stored) {
      const parsed = JSON.parse(stored)
      setUser(parsed.user)
      setToken(parsed.token)
    }

    // 🔑 SEMPRE libera render
    setReady(true)
  }, [])

  function login(data: { user: User; token: string }) {
    setUser(data.user)
    setToken(data.token)
    localStorage.setItem('auth', JSON.stringify(data))
  }

  function logout() {
    setUser(null)
    setToken(null)
    localStorage.removeItem('auth')
  }

  return (
    <AuthContext.Provider
      value={{ user, token, ready, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error(
      'useAuth must be used within AuthProvider'
    )
  }
  return ctx
}
