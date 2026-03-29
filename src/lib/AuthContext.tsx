import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import type { AuthError, LocalSession, LocalUser } from './local-auth-types'
import {
  clearDemoSession,
  DEMO_PASSWORD,
  getLocalSessionFromStorage,
  readDemoUsers,
  setPendingSignupOtp,
  subscribeDemoSession,
  writeDemoSession,
  writeDemoUsers,
} from './demo-auth-storage'

interface AuthState {
  user: LocalUser | null
  session: LocalSession | null
  loading: boolean
}

interface AuthContextValue extends AuthState {
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: AuthError | null }>
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
  })

  useEffect(() => {
    function sync() {
      const session = getLocalSessionFromStorage()
      setState({
        user: session?.user ?? null,
        session,
        loading: false,
      })
    }
    sync()
    return subscribeDemoSession(sync)
  }, [])

  const signUp = useCallback(async (email: string, password: string, fullName?: string) => {
    const normalized = email.trim()
    if (!normalized) {
      return { error: { message: 'Email is required', name: 'AuthError' } satisfies AuthError }
    }
    if (password !== DEMO_PASSWORD) {
      return {
        error: { message: 'For demo, password must be 123.', name: 'AuthError' } satisfies AuthError,
      }
    }
    const users = readDemoUsers()
    if (users[normalized]) {
      return { error: { message: 'User already registered', name: 'AuthError' } satisfies AuthError }
    }
    users[normalized] = {
      email: normalized,
      fullName: fullName?.trim() || normalized.split('@')[0] || normalized,
      createdAt: Date.now(),
    }
    writeDemoUsers(users)
    setPendingSignupOtp(normalized)
    return { error: null }
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    const normalized = email.trim()
    if (!normalized) {
      return { error: { message: 'Email is required', name: 'AuthError' } satisfies AuthError }
    }
    if (password !== DEMO_PASSWORD) {
      return {
        error: { message: 'For demo, password must be 123.', name: 'AuthError' } satisfies AuthError,
      }
    }
    const users = readDemoUsers()
    if (!users[normalized]) {
      users[normalized] = {
        email: normalized,
        fullName: normalized.split('@')[0] || normalized,
        createdAt: Date.now(),
      }
      writeDemoUsers(users)
    }
    writeDemoSession(normalized)
    return { error: null }
  }, [])

  const signOut = useCallback(async () => {
    clearDemoSession()
  }, [])

  return (
    <AuthContext.Provider value={{ ...state, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
