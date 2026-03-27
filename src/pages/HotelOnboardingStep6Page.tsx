import type { FormEvent } from "react";
import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Construction } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { OnboardingBottomNav } from "@/components/onboarding/OnboardingBottomNav";
import { OnboardingTopNav } from "@/components/onboarding/OnboardingTopNav";

const STEP = 6;

export default function HotelOnboardingStep6Page() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const copy = useMemo(() => t.onboardingHotelStep6Wip, [t.onboardingHotelStep6Wip]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    navigate("/book-demo/calendar", {
      state: {
        businessType: "hotel",
        onboardingStep: STEP,
        ...(location.state ?? {}),
      },
    });
  }

  return (
    <motion.div
      className="min-h-screen bg-background text-foreground selection:bg-accent/20"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <OnboardingTopNav step={STEP} />

      <main className="px-6 max-w-[640px] mx-auto pb-32 pt-10">
        <form id="hotel-step6-wip-form" onSubmit={handleSubmit}>
          <div className="rounded-2xl bg-card border border-border/40 p-8 text-center shadow-sm">
            <div className="w-14 h-14 rounded-full bg-accent/10 text-accent mx-auto flex items-center justify-center mb-4">
              <Construction className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-3">{copy.headline}</h1>
            <p className="text-muted-foreground leading-relaxed mb-6">{copy.subhead}</p>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="inline-flex items-center justify-center rounded-lg border border-border/50 px-5 py-2.5 text-sm font-semibold hover:bg-muted/40 transition-colors"
            >
              {copy.backToMainMenu}
            </button>
          </div>
        </form>
      </main>

      <OnboardingBottomNav
        backLabel={copy.back}
        continueLabel={copy.continue}
        onBack={() => navigate("/onboarding/hotel/step-5", { state: location.state })}
        formId="hotel-step6-wip-form"
      />
    </motion.div>
  );
}
