/** Shapes compatible with previous Supabase auth usage in the UI. */

export interface AuthError {
  message: string
  name?: string
  status?: number
}

export interface LocalUser {
  id: string
  email?: string
  user_metadata?: Record<string, unknown>
}

export interface LocalSession {
  access_token: string
  user: LocalUser
}
