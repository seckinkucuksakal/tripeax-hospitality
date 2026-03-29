/** Local demo auth — same keys as AuthPage, no Supabase. */

import type { LocalSession } from './local-auth-types'

export const DEMO_USERS_KEY = 'tripeax_demo_users_v1'
export const DEMO_SESSION_KEY = 'tripeax_demo_session_v1'
export const DEMO_PASSWORD = '123'

const SESSION_CHANGE = 'tripeax-demo-session-change'

export type DemoUserRecord = {
  email: string
  fullName: string
  phone?: string
  whatsapp?: string
  createdAt: number
}

export type DemoSessionPayload = {
  email: string
  createdAt: number
}

export function readDemoUsers(): Record<string, DemoUserRecord> {
  try {
    const raw = localStorage.getItem(DEMO_USERS_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as Record<string, DemoUserRecord>
  } catch {
    return {}
  }
}

export function writeDemoUsers(users: Record<string, DemoUserRecord>) {
  localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users))
}

export function readDemoSession(): DemoSessionPayload | null {
  try {
    const raw = localStorage.getItem(DEMO_SESSION_KEY)
    if (!raw) return null
    return JSON.parse(raw) as DemoSessionPayload
  } catch {
    return null
  }
}

export function writeDemoSession(email: string) {
  const payload: DemoSessionPayload = { email, createdAt: Date.now() }
  localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(payload))
  window.dispatchEvent(new Event(SESSION_CHANGE))
}

export function clearDemoSession() {
  localStorage.removeItem(DEMO_SESSION_KEY)
  window.dispatchEvent(new Event(SESSION_CHANGE))
}

export function subscribeDemoSession(onChange: () => void): () => void {
  const onCustom = () => onChange()
  const onStorage = (e: StorageEvent) => {
    if (e.key === DEMO_SESSION_KEY) onChange()
  }
  window.addEventListener(SESSION_CHANGE, onCustom)
  window.addEventListener('storage', onStorage)
  return () => {
    window.removeEventListener(SESSION_CHANGE, onCustom)
    window.removeEventListener('storage', onStorage)
  }
}

function otpStorageKey(email: string) {
  return `tripeax_demo_otp_${email.toLowerCase()}`
}

export function setPendingSignupOtp(email: string): string {
  const code = String(Math.floor(10_000_000 + Math.random() * 90_000_000))
  sessionStorage.setItem(otpStorageKey(email), code)
  if (import.meta.env.DEV) {
    console.info(`[demo auth] OTP for ${email}: ${code}`)
  }
  return code
}

export function verifyPendingSignupOtp(
  email: string,
  token: string,
): { ok: boolean } {
  const key = otpStorageKey(email)
  const stored = sessionStorage.getItem(key)
  if (!stored || stored !== token) return { ok: false }
  sessionStorage.removeItem(key)
  return { ok: true }
}

export function resendPendingSignupOtp(email: string): string {
  return setPendingSignupOtp(email)
}

export function demoPayloadToSession(payload: DemoSessionPayload): LocalSession {
  const users = readDemoUsers()
  const rec = users[payload.email]
  return {
    access_token: 'local-demo',
    user: {
      id: payload.email,
      email: payload.email,
      user_metadata: rec
        ? { full_name: rec.fullName }
        : { full_name: payload.email.split('@')[0] ?? payload.email },
    },
  }
}

export function getLocalSessionFromStorage(): LocalSession | null {
  const p = readDemoSession()
  if (!p?.email) return null
  return demoPayloadToSession(p)
}
