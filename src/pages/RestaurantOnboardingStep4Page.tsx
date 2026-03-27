import type { ChangeEvent, FormEvent } from "react";
import { useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Info, Upload } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { OnboardingBottomNav } from "@/components/onboarding/OnboardingBottomNav";
import { OnboardingTopNav } from "@/components/onboarding/OnboardingTopNav";

const STEP = 4;

type ChainState = {
  profile?: unknown;
  operatingHours?: unknown;
  reservationSettings?: unknown;
};

export default function RestaurantOnboardingStep4Page() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const copy = useMemo(() => t.onboardingRestaurantMenu, [t.onboardingRestaurantMenu]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [menuFileName, setMenuFileName] = useState<string | null>(null);
  const [corkage, setCorkage] = useState("");
  const [dailySpecials, setDailySpecials] = useState("");
  const [chefRecommendation, setChefRecommendation] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const prev = (location.state ?? null) as ChainState | null;
    navigate("/onboarding/restaurant/step-5", {
      state: {
        profile: prev?.profile,
        operatingHours: prev?.operatingHours,
        reservationSettings: prev?.reservationSettings,
        menu: {
          menuFileName,
          corkage: corkage.trim() || undefined,
          dailySpecials: dailySpecials.trim() || undefined,
          chefRecommendation: chefRecommendation.trim() || undefined,
        },
      },
    });
  }

  function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    setMenuFileName(f?.name ?? null);
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
        <section className="mb-10 text-center md:text-left">
          <h1 className="text-3xl font-bold text-foreground tracking-tight mb-3">{copy.headline}</h1>
          <p className="text-muted-foreground leading-relaxed">{copy.subhead}</p>
        </section>

        <form id="restaurant-menu-form" className="space-y-8" onSubmit={handleSubmit}>
          <div className="bg-card ring-1 ring-border/30 rounded-xl p-8 text-center shadow-sm">
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4 mx-auto">
              <Upload className="h-8 w-8 text-accent" aria-hidden />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">{copy.uploadTitle}</h3>
            <p className="text-sm text-muted-foreground mb-6">{copy.uploadDesc}</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
              className="sr-only"
              onChange={onFileChange}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-accent text-accent-foreground font-semibold py-3 px-6 rounded-lg hover:bg-accent/90 transition-colors flex items-center justify-center gap-2"
            >
              <Upload className="h-5 w-5 shrink-0" />
              {copy.chooseFile}
            </button>
            {menuFileName ? (
              <p className="mt-3 text-sm font-medium text-foreground truncate max-w-full">{menuFileName}</p>
            ) : null}
            <p className="mt-4 text-xs text-muted-foreground font-medium uppercase tracking-wider">{copy.acceptedFormats}</p>
          </div>

          <div className="space-y-6 pt-2">
            <div className="flex items-center gap-2 mb-2">
              <Info className="h-5 w-5 text-accent shrink-0" aria-hidden />
              <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">{copy.additionalDetails}</h3>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-foreground">{copy.corkageLabel}</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min={0}
                  value={corkage}
                  onChange={(e) => setCorkage(e.target.value)}
                  placeholder={copy.corkagePlaceholder}
                  className="w-full bg-background border-0 ring-1 ring-border/40 rounded-lg pl-4 pr-12 py-3 text-sm focus:ring-2 focus:ring-accent focus:outline-none transition-all placeholder:text-muted-foreground/50 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground tabular-nums">
                  {copy.currencySymbol}
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground px-1">{copy.corkageHint}</p>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-foreground">{copy.dailySpecialsLabel}</label>
              <textarea
                value={dailySpecials}
                onChange={(e) => setDailySpecials(e.target.value)}
                placeholder={copy.dailySpecialsPlaceholder}
                rows={2}
                className="w-full bg-background border-0 ring-1 ring-border/40 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-accent focus:outline-none transition-all placeholder:text-muted-foreground/50 resize-none"
              />
              <p className="text-[11px] text-muted-foreground px-1">{copy.dailySpecialsHint}</p>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-foreground">{copy.chefLabel}</label>
              <textarea
                value={chefRecommendation}
                onChange={(e) => setChefRecommendation(e.target.value)}
                placeholder={copy.chefPlaceholder}
                rows={3}
                className="w-full bg-background border-0 ring-1 ring-border/40 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-accent focus:outline-none transition-all placeholder:text-muted-foreground/50 resize-none"
              />
            </div>
          </div>

          <div className="p-4 bg-muted/40 rounded-lg ring-1 ring-accent/10">
            <p className="text-xs text-muted-foreground leading-relaxed italic text-center">{copy.footerNote}</p>
          </div>
        </form>
      </main>

      <OnboardingBottomNav
        backLabel={copy.back}
        continueLabel={copy.continue}
        onBack={() => navigate("/onboarding/restaurant/step-3", { state: location.state })}
        formId="restaurant-menu-form"
      />
    </motion.div>
  );
}
