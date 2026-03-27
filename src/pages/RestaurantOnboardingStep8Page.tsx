import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Coffee, Lightbulb, Mic, PhoneForwarded, Smile, Verified } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { OnboardingBottomNav } from "@/components/onboarding/OnboardingBottomNav";
import { OnboardingTopNav } from "@/components/onboarding/OnboardingTopNav";

const STEP = 8;

type ToneKey = "warm" | "professional" | "casual";

type VoicePersona = {
  tone: ToneKey;
  customGreeting?: string;
  transferMessage?: string;
};

type ChainState = {
  profile?: unknown;
  operatingHours?: unknown;
  menu?: unknown;
  reservationSettings?: unknown;
  reservationIntegration?: unknown;
  callerFaqs?: unknown;
  aiVoicePersona?: VoicePersona;
};

export default function RestaurantOnboardingStep8Page() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const copy = useMemo(() => t.onboardingRestaurantVoicePersona, [t.onboardingRestaurantVoicePersona]);

  const initial = (location.state as ChainState | null)?.aiVoicePersona;
  const [tone, setTone] = useState<ToneKey>(initial?.tone ?? "warm");
  const [customGreeting, setCustomGreeting] = useState(initial?.customGreeting ?? "");
  const [transferMessage, setTransferMessage] = useState(initial?.transferMessage ?? "");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const prev = (location.state ?? null) as ChainState | null;
    navigate("/onboarding/restaurant/step-9", {
      state: {
        profile: prev?.profile,
        operatingHours: prev?.operatingHours,
        menu: prev?.menu,
        reservationSettings: prev?.reservationSettings,
        reservationIntegration: prev?.reservationIntegration,
        callerFaqs: prev?.callerFaqs,
        aiVoicePersona: {
          tone,
          customGreeting: customGreeting.trim() || undefined,
          transferMessage: transferMessage.trim() || undefined,
        } satisfies VoicePersona,
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

      <main className="px-6 max-w-[640px] mx-auto pb-32 pt-6">
        <section className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight mb-3">{copy.headline}</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">{copy.subhead}</p>
        </section>

        <form id="restaurant-voice-form" className="space-y-8" onSubmit={handleSubmit}>
          <section>
            <h2 className="text-sm font-semibold text-accent uppercase tracking-widest mb-4">{copy.toneTitle}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setTone("warm")}
                className={`flex flex-col items-start p-5 rounded-xl border-2 text-left transition-all ${
                  tone === "warm"
                    ? "border-accent bg-accent/5"
                    : "border-transparent bg-card hover:bg-muted/40"
                }`}
              >
                <Smile className={`h-5 w-5 mb-3 ${tone === "warm" ? "text-accent" : "text-muted-foreground"}`} />
                <p className="font-bold mb-1">{copy.warmTitle}</p>
                <p className="text-xs text-muted-foreground italic">{copy.warmHint}</p>
              </button>
              <button
                type="button"
                onClick={() => setTone("professional")}
                className={`flex flex-col items-start p-5 rounded-xl border-2 text-left transition-all ${
                  tone === "professional"
                    ? "border-accent bg-accent/5"
                    : "border-transparent bg-card hover:bg-muted/40"
                }`}
              >
                <Verified className={`h-5 w-5 mb-3 ${tone === "professional" ? "text-accent" : "text-muted-foreground"}`} />
                <p className="font-bold mb-1">{copy.professionalTitle}</p>
                <p className="text-xs text-muted-foreground italic">{copy.professionalHint}</p>
              </button>
              <button
                type="button"
                onClick={() => setTone("casual")}
                className={`flex flex-col items-start p-5 rounded-xl border-2 text-left transition-all ${
                  tone === "casual"
                    ? "border-accent bg-accent/5"
                    : "border-transparent bg-card hover:bg-muted/40"
                }`}
              >
                <Coffee className={`h-5 w-5 mb-3 ${tone === "casual" ? "text-accent" : "text-muted-foreground"}`} />
                <p className="font-bold mb-1">{copy.casualTitle}</p>
                <p className="text-xs text-muted-foreground italic">{copy.casualHint}</p>
              </button>
            </div>
          </section>

          <section className="p-6 bg-card rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              <Mic className="h-5 w-5 text-accent" />
              <label className="text-sm font-semibold" htmlFor="custom-greeting">
                {copy.customGreetingLabel}
              </label>
            </div>
            <textarea
              id="custom-greeting"
              value={customGreeting}
              onChange={(e) => setCustomGreeting(e.target.value)}
              rows={3}
              placeholder={copy.customGreetingPlaceholder}
              className="w-full bg-background border border-border/40 rounded-lg p-4 text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all"
            />
            <p className="mt-2 text-[11px] text-muted-foreground font-medium uppercase tracking-wider">{copy.customGreetingHint}</p>
          </section>

          <div className="bg-card rounded-xl overflow-hidden flex shadow-sm">
            <div className="w-1.5 bg-accent" />
            <div className="p-4 flex items-start gap-4">
              <Lightbulb className="h-5 w-5 text-accent shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold">{copy.tipTitle}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed mt-1">{copy.tipDesc}</p>
              </div>
            </div>
          </div>

          <section className="p-6 bg-card rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              <PhoneForwarded className="h-5 w-5 text-accent" />
              <label className="text-sm font-semibold" htmlFor="transfer-message">
                {copy.transferLabel}
              </label>
            </div>
            <textarea
              id="transfer-message"
              value={transferMessage}
              onChange={(e) => setTransferMessage(e.target.value)}
              rows={2}
              placeholder={copy.transferPlaceholder}
              className="w-full bg-background border border-border/40 rounded-lg p-4 text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all"
            />
            <p className="mt-2 text-[11px] text-muted-foreground font-medium uppercase tracking-wider">{copy.transferHint}</p>
          </section>
        </form>
      </main>

      <OnboardingBottomNav
        backLabel={copy.back}
        continueLabel={copy.continue}
        onBack={() => navigate("/onboarding/restaurant/step-7", { state: location.state })}
        formId="restaurant-voice-form"
      />
    </motion.div>
  );
}
