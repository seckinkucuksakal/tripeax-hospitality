import { useLanguage } from "@/lib/LanguageContext";
import { ONBOARDING_TOTAL_STEPS, onboardingProgressPercent } from "@/lib/onboarding";

type Props = {
  step: number;
};

/**
 * Shared onboarding header: Tripeax + step label + EN|TR + full-width green progress bar.
 * Matches `BusinessSelectionPage` bar styling (h-1.5, bg-border track, bg-accent fill).
 */
export function OnboardingTopNav({ step }: Props) {
  const { lang, setLang, t } = useLanguage();
  const pct = onboardingProgressPercent(step);
  const stepLine = t.onboarding.stepLabel
    .replace("{current}", String(step))
    .replace("{total}", String(ONBOARDING_TOTAL_STEPS));

  return (
    <nav className="relative z-10 w-full bg-background pt-8 pb-4">
      <div className="max-w-[760px] mx-auto px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
          <span className="text-accent font-extrabold text-xl tracking-tight shrink-0">Tripeax</span>
          <div className="relative flex flex-wrap items-center gap-x-3 gap-y-2 sm:justify-end">
            <div className="text-[12px] font-bold text-muted-foreground tracking-widest tabular-nums">
              {stepLine}
            </div>
            <div
              className="flex items-center rounded-lg border border-border overflow-hidden text-sm shadow-sm"
              role="group"
              aria-label="Language"
            >
              <button
                type="button"
                aria-pressed={lang === "en"}
                onClick={() => setLang("en")}
                className={`min-h-10 min-w-[44px] px-3 py-2 font-semibold transition-colors cursor-pointer ${
                  lang === "en"
                    ? "bg-foreground text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground bg-background"
                }`}
              >
                EN
              </button>
              <button
                type="button"
                aria-pressed={lang === "tr"}
                onClick={() => setLang("tr")}
                className={`min-h-10 min-w-[44px] px-3 py-2 font-semibold transition-colors cursor-pointer border-l border-border ${
                  lang === "tr"
                    ? "bg-foreground text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground bg-background"
                }`}
              >
                TR
              </button>
            </div>
          </div>
        </div>

        <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-[width] duration-500 ease-out"
            style={{ width: `${pct}%` }}
            aria-valuenow={step}
            aria-valuemin={1}
            aria-valuemax={ONBOARDING_TOTAL_STEPS}
            role="progressbar"
          />
        </div>
      </div>
    </nav>
  );
}
