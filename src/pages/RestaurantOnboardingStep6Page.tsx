import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { OnboardingBottomNav } from "@/components/onboarding/OnboardingBottomNav";
import { OnboardingTopNav } from "@/components/onboarding/OnboardingTopNav";

const STEP = 6;

const SYSTEM_KEYS = ["thefork", "google", "rezo", "checkplace", "zenchef", "paper", "other"] as const;
type SystemKey = (typeof SYSTEM_KEYS)[number];

type ReservationIntegration = {
  system: SystemKey;
  theForkPropertyId?: string;
  googleBusinessUrl?: string;
  rezoUsername?: string;
  rezoPassword?: string;
  checkplaceUsername?: string;
  checkplacePassword?: string;
  zenchefRestaurantId?: string;
  otherSystemNotes?: string;
};

type ChainState = {
  profile?: unknown;
  operatingHours?: unknown;
  menu?: unknown;
  reservationSettings?: unknown;
  reservationIntegration?: ReservationIntegration;
  callerFaqs?: unknown;
};

export default function RestaurantOnboardingStep6Page() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const copy = useMemo(() => t.onboardingRestaurantReservationSystem, [t.onboardingRestaurantReservationSystem]);

  const initial = (location.state as ChainState | null)?.reservationIntegration;
  const [system, setSystem] = useState<SystemKey>(initial?.system ?? "paper");
  const [theForkPropertyId, setTheForkPropertyId] = useState(initial?.theForkPropertyId ?? "");
  const [googleBusinessUrl, setGoogleBusinessUrl] = useState(initial?.googleBusinessUrl ?? "");
  const [rezoUsername, setRezoUsername] = useState(initial?.rezoUsername ?? "");
  const [rezoPassword, setRezoPassword] = useState(initial?.rezoPassword ?? "");
  const [checkplaceUsername, setCheckplaceUsername] = useState(initial?.checkplaceUsername ?? "");
  const [checkplacePassword, setCheckplacePassword] = useState(initial?.checkplacePassword ?? "");
  const [zenchefRestaurantId, setZenchefRestaurantId] = useState(initial?.zenchefRestaurantId ?? "");
  const [otherSystemNotes, setOtherSystemNotes] = useState(initial?.otherSystemNotes ?? "");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const prev = (location.state ?? null) as ChainState | null;
    navigate("/onboarding/restaurant/step-7", {
      state: {
        profile: prev?.profile,
        operatingHours: prev?.operatingHours,
        menu: prev?.menu,
        reservationSettings: prev?.reservationSettings,
        callerFaqs: prev?.callerFaqs,
        reservationIntegration: {
          system,
          theForkPropertyId: theForkPropertyId.trim() || undefined,
          googleBusinessUrl: googleBusinessUrl.trim() || undefined,
          rezoUsername: rezoUsername.trim() || undefined,
          rezoPassword: rezoPassword.trim() || undefined,
          checkplaceUsername: checkplaceUsername.trim() || undefined,
          checkplacePassword: checkplacePassword.trim() || undefined,
          zenchefRestaurantId: zenchefRestaurantId.trim() || undefined,
          otherSystemNotes: otherSystemNotes.trim() || undefined,
        } satisfies ReservationIntegration,
      },
    });
  }

  const cardBase =
    "bg-card p-6 rounded-xl border ring-1 ring-border/20 transition-all duration-200 cursor-pointer";

  return (
    <motion.div
      className="min-h-screen bg-background text-foreground selection:bg-accent/20"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <OnboardingTopNav step={STEP} />

      <main className="px-6 max-w-[1100px] mx-auto pb-40 pt-6">
        <section className="mb-10 text-center max-w-3xl mx-auto">
          <h1 className="text-[2rem] sm:text-[2.5rem] font-bold text-foreground leading-tight tracking-tight mb-3">{copy.headline}</h1>
          <p className="text-muted-foreground leading-relaxed">{copy.subhead}</p>
        </section>

        <form id="restaurant-reservation-system-form" className="space-y-8" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <label className={`${cardBase} ${system === "thefork" ? "border-accent ring-accent/30" : "border-border/30"}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-lg">{copy.theforkTitle}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{copy.theforkDesc}</p>
                </div>
                <input type="radio" name="res-system" className="mt-1" checked={system === "thefork"} onChange={() => setSystem("thefork")} />
              </div>
              <input
                value={theForkPropertyId}
                onChange={(e) => setTheForkPropertyId(e.target.value)}
                placeholder={copy.theforkPlaceholder}
                className="mt-4 w-full bg-background border border-border/50 rounded-lg p-3 text-sm focus:ring-2 focus:ring-accent focus:outline-none"
              />
            </label>

            <label className={`${cardBase} ${system === "google" ? "border-accent ring-accent/30" : "border-border/30"}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-lg">{copy.googleTitle}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{copy.googleDesc}</p>
                </div>
                <input type="radio" name="res-system" className="mt-1" checked={system === "google"} onChange={() => setSystem("google")} />
              </div>
              <input
                type="url"
                value={googleBusinessUrl}
                onChange={(e) => setGoogleBusinessUrl(e.target.value)}
                placeholder={copy.googlePlaceholder}
                className="mt-4 w-full bg-background border border-border/50 rounded-lg p-3 text-sm focus:ring-2 focus:ring-accent focus:outline-none"
              />
            </label>

            <label className={`${cardBase} ${system === "rezo" ? "border-accent ring-accent/30" : "border-border/30"}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-lg">{copy.rezoTitle}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{copy.rezoDesc}</p>
                </div>
                <input type="radio" name="res-system" className="mt-1" checked={system === "rezo"} onChange={() => setSystem("rezo")} />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <input
                  value={rezoUsername}
                  onChange={(e) => setRezoUsername(e.target.value)}
                  placeholder={copy.username}
                  className="w-full bg-background border border-border/50 rounded-lg p-3 text-sm focus:ring-2 focus:ring-accent focus:outline-none"
                />
                <input
                  type="password"
                  value={rezoPassword}
                  onChange={(e) => setRezoPassword(e.target.value)}
                  placeholder={copy.password}
                  className="w-full bg-background border border-border/50 rounded-lg p-3 text-sm focus:ring-2 focus:ring-accent focus:outline-none"
                />
              </div>
            </label>

            <label className={`${cardBase} ${system === "checkplace" ? "border-accent ring-accent/30" : "border-border/30"}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-lg">{copy.checkplaceTitle}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{copy.checkplaceDesc}</p>
                </div>
                <input type="radio" name="res-system" className="mt-1" checked={system === "checkplace"} onChange={() => setSystem("checkplace")} />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <input
                  value={checkplaceUsername}
                  onChange={(e) => setCheckplaceUsername(e.target.value)}
                  placeholder={copy.username}
                  className="w-full bg-background border border-border/50 rounded-lg p-3 text-sm focus:ring-2 focus:ring-accent focus:outline-none"
                />
                <input
                  type="password"
                  value={checkplacePassword}
                  onChange={(e) => setCheckplacePassword(e.target.value)}
                  placeholder={copy.password}
                  className="w-full bg-background border border-border/50 rounded-lg p-3 text-sm focus:ring-2 focus:ring-accent focus:outline-none"
                />
              </div>
            </label>

            <label className={`${cardBase} ${system === "zenchef" ? "border-accent ring-accent/30" : "border-border/30"}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-lg">{copy.zenchefTitle}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{copy.zenchefDesc}</p>
                </div>
                <input type="radio" name="res-system" className="mt-1" checked={system === "zenchef"} onChange={() => setSystem("zenchef")} />
              </div>
              <input
                value={zenchefRestaurantId}
                onChange={(e) => setZenchefRestaurantId(e.target.value)}
                placeholder={copy.zenchefPlaceholder}
                className="mt-4 w-full bg-background border border-border/50 rounded-lg p-3 text-sm focus:ring-2 focus:ring-accent focus:outline-none"
              />
            </label>

            <label
              className={`${cardBase} ${system === "paper" ? "border-accent ring-accent/40 bg-accent/5" : "border-border/30"} md:col-span-1`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-lg">{copy.paperTitle}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{copy.paperDesc}</p>
                </div>
                {system === "paper" ? (
                  <span className="w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="h-4 w-4" />
                  </span>
                ) : (
                  <input type="radio" name="res-system" className="mt-1" checked={false} onChange={() => setSystem("paper")} />
                )}
              </div>
              <input type="radio" name="res-system" className="sr-only" checked={system === "paper"} onChange={() => setSystem("paper")} />
            </label>

            <label className={`${cardBase} ${system === "other" ? "border-accent ring-accent/30" : "border-border/30"} md:col-span-3`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-lg">{copy.otherTitle}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{copy.otherDesc}</p>
                </div>
                <input type="radio" name="res-system" className="mt-1" checked={system === "other"} onChange={() => setSystem("other")} />
              </div>
              <textarea
                value={otherSystemNotes}
                onChange={(e) => setOtherSystemNotes(e.target.value)}
                rows={2}
                placeholder={copy.otherPlaceholder}
                className="mt-4 w-full bg-background border border-border/50 rounded-lg p-3 text-sm resize-none focus:ring-2 focus:ring-accent focus:outline-none"
              />
            </label>
          </div>

          <div className="rounded-2xl border border-border/30 bg-card/80 backdrop-blur-sm p-6 flex flex-col md:flex-row items-start md:items-center gap-4">
            <div>
              <h4 className="font-semibold text-foreground">{copy.helpTitle}</h4>
              <p className="text-sm text-muted-foreground mt-1">{copy.helpDesc}</p>
            </div>
            <button type="button" className="md:ml-auto whitespace-nowrap border border-border/50 rounded-lg px-5 py-2.5 text-sm font-semibold hover:bg-muted/40">
              {copy.helpCta}
            </button>
          </div>
        </form>
      </main>

      <OnboardingBottomNav
        backLabel={copy.back}
        continueLabel={copy.continue}
        onBack={() => navigate("/onboarding/restaurant/step-5", { state: location.state })}
        formId="restaurant-reservation-system-form"
      />
    </motion.div>
  );
}
