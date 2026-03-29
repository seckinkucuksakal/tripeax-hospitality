/** Total steps in the onboarding flow (progress bar + step label). */
export const ONBOARDING_TOTAL_STEPS = 8;

export function onboardingProgressPercent(step: number): number {
  if (step < 1) return 0;
  if (step > ONBOARDING_TOTAL_STEPS) return 100;
  return Math.round((step / ONBOARDING_TOTAL_STEPS) * 100);
}
