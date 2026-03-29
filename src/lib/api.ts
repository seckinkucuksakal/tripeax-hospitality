import { supabase } from './supabase'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

async function getAccessToken(): Promise<string | null> {
  const { data } = await supabase.auth.getSession()
  return data.session?.access_token ?? null
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = await getAccessToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new ApiError(
      body.error ?? `Request failed: ${res.status}`,
      res.status,
      body.code,
    )
  }

  if (res.status === 204) return undefined as T
  return res.json()
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// ── User / Me ────────────────────────────────────────────────────────────────

export interface MeResponse {
  id: string
  email: string
  businesses: Array<{
    id: string
    name: string
    slug: string
    template_type: 'restaurant' | 'hotel'
    plan: string
    is_active: boolean
    parent_business_id: string | null
    role: string
  }>
}

export function fetchMe(): Promise<MeResponse> {
  return request('/api/v1/me')
}

// ── Businesses ───────────────────────────────────────────────────────────────

export interface CreateBusinessRequest {
  name: string
  slug: string
  template_type: 'restaurant' | 'hotel'
  phone?: string
  whatsapp_number?: string
  address?: string
  timezone?: string
  language?: string
  owner_email: string
}

export interface CreateBusinessResponse {
  id: string
  name: string
  slug: string
  api_key: string
  stripe_customer_id: string | null
}

export function createBusiness(data: CreateBusinessRequest): Promise<CreateBusinessResponse> {
  return request('/api/v1/businesses', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export interface UpdateBusinessRequest {
  name?: string
  phone?: string
  whatsapp_number?: string
  address?: string
  timezone?: string
  language?: string
  settings?: Record<string, unknown>
  knowledge_base?: Record<string, unknown>
}

export function updateBusiness(id: string, data: UpdateBusinessRequest): Promise<{ success: boolean }> {
  return request(`/api/v1/businesses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function fetchBusiness(id: string): Promise<Record<string, unknown>> {
  return request(`/api/v1/businesses/${id}`)
}

// ── Business Hours ───────────────────────────────────────────────────────────

export interface BusinessHourEntry {
  day_of_week: number
  open_time: string | null
  close_time: string | null
  open_time_2?: string | null
  close_time_2?: string | null
  kitchen_last_order?: string | null
  last_reservation_time?: string | null
  is_closed: boolean
}

export function fetchBusinessHours(businessId: string): Promise<BusinessHourEntry[]> {
  return request(`/api/v1/businesses/${businessId}/hours`)
}

export function updateBusinessHours(
  businessId: string,
  hours: BusinessHourEntry[],
): Promise<{ success: boolean }> {
  return request(`/api/v1/businesses/${businessId}/hours`, {
    method: 'PUT',
    body: JSON.stringify({ hours }),
  })
}

// ── Knowledge Base ───────────────────────────────────────────────────────────

export function fetchKnowledgeBase(businessId: string): Promise<Record<string, unknown>> {
  return request(`/api/v1/businesses/${businessId}/knowledge-base`)
}

export function updateKnowledgeBase(
  businessId: string,
  data: Record<string, unknown>,
): Promise<{ success: boolean }> {
  return request(`/api/v1/businesses/${businessId}/knowledge-base`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

// ── Onboarding ───────────────────────────────────────────────────────────────

export interface OnboardingStatus {
  business_id: string
  steps: Record<string, { completed: boolean; skipped: boolean; completed_at?: string }>
  is_complete: boolean
  progress_percent: number
}

export function fetchOnboardingStatus(businessId: string): Promise<OnboardingStatus> {
  return request(`/api/v1/businesses/${businessId}/onboarding`)
}

export function completeOnboardingStep(
  businessId: string,
  step: string,
): Promise<OnboardingStatus> {
  return request(`/api/v1/businesses/${businessId}/onboarding/complete/${step}`, {
    method: 'POST',
  })
}

export function skipOnboardingStep(
  businessId: string,
  step: string,
): Promise<OnboardingStatus> {
  return request(`/api/v1/businesses/${businessId}/onboarding/skip/${step}`, {
    method: 'POST',
  })
}

// ── Availability ─────────────────────────────────────────────────────────────

export function updateTableInventory(
  businessId: string,
  data: Record<string, unknown>,
): Promise<unknown> {
  return request(`/api/v1/businesses/${businessId}/availability/tables`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function updateRoomInventory(
  businessId: string,
  data: Record<string, unknown>,
): Promise<unknown> {
  return request(`/api/v1/businesses/${businessId}/availability/rooms`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}
