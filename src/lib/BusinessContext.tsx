import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react'

interface BusinessState {
  businessId: string | null
  businessName: string | null
  templateType: 'restaurant' | 'hotel' | null
  slug: string | null
}

interface BusinessContextValue extends BusinessState {
  setActiveBusiness: (biz: {
    id: string
    name: string
    template_type: 'restaurant' | 'hotel'
    slug: string
  }) => void
  clearBusiness: () => void
}

const STORAGE_KEY = 'rms_active_business'

function loadFromStorage(): BusinessState {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return { businessId: null, businessName: null, templateType: null, slug: null }
    const parsed = JSON.parse(raw)
    return {
      businessId: parsed.businessId ?? null,
      businessName: parsed.businessName ?? null,
      templateType: parsed.templateType ?? null,
      slug: parsed.slug ?? null,
    }
  } catch {
    return { businessId: null, businessName: null, templateType: null, slug: null }
  }
}

function saveToStorage(state: BusinessState) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

const BusinessContext = createContext<BusinessContextValue | undefined>(undefined)

export function BusinessProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<BusinessState>(loadFromStorage)

  const setActiveBusiness = useCallback(
    (biz: { id: string; name: string; template_type: 'restaurant' | 'hotel'; slug: string }) => {
      const next: BusinessState = {
        businessId: biz.id,
        businessName: biz.name,
        templateType: biz.template_type,
        slug: biz.slug,
      }
      setState(next)
      saveToStorage(next)
    },
    [],
  )

  const clearBusiness = useCallback(() => {
    const empty: BusinessState = { businessId: null, businessName: null, templateType: null, slug: null }
    setState(empty)
    sessionStorage.removeItem(STORAGE_KEY)
  }, [])

  return (
    <BusinessContext.Provider value={{ ...state, setActiveBusiness, clearBusiness }}>
      {children}
    </BusinessContext.Provider>
  )
}

export function useBusiness(): BusinessContextValue {
  const ctx = useContext(BusinessContext)
  if (!ctx) throw new Error('useBusiness must be used within a BusinessProvider')
  return ctx
}
