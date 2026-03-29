import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useBusiness } from '@/lib/BusinessContext'
import {
  updateBusiness,
  updateBusinessHours,
  updateKnowledgeBase,
  completeOnboardingStep,
  type BusinessHourEntry,
} from '@/lib/api'
import { toast } from 'sonner'

type SaveTarget =
  | { type: 'business'; data: Record<string, unknown> }
  | { type: 'hours'; data: BusinessHourEntry[] }
  | { type: 'knowledge_base'; data: Record<string, unknown> }

interface UseOnboardingSaveOptions {
  nextPath: string
  onboardingStep?: string
}

export function useOnboardingSave({ nextPath, onboardingStep }: UseOnboardingSaveOptions) {
  const navigate = useNavigate()
  const { businessId } = useBusiness()

  return useMutation({
    mutationFn: async (target: SaveTarget) => {
      if (!businessId) throw new Error('No business selected')

      switch (target.type) {
        case 'business':
          await updateBusiness(businessId, target.data)
          break
        case 'hours':
          await updateBusinessHours(businessId, target.data)
          break
        case 'knowledge_base':
          await updateKnowledgeBase(businessId, target.data)
          break
      }

      if (onboardingStep) {
        await completeOnboardingStep(businessId, onboardingStep).catch(() => {})
      }
    },
    onSuccess: () => {
      navigate(nextPath)
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })
}
