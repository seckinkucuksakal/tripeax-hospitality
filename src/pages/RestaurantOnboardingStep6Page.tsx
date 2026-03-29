import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Copy, Mail } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { OnboardingBottomNav } from "@/components/onboarding/OnboardingBottomNav";
import { OnboardingTopNav } from "@/components/onboarding/OnboardingTopNav";
import { SystemSelectIndicator } from "@/components/onboarding/SystemSelectIndicator";

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
  const [emailCopied, setEmailCopied] = useState(false);

  async function copySupportEmail() {
    try {
      await navigator.clipboard.writeText(copy.businessSupportEmail);
      setEmailCopied(true);
      window.setTimeout(() => setEmailCopied(false), 2000);
    } catch {
      /* clipboard may be blocked */
    }
  }

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

  const cardSelected = (key: SystemKey) =>
    system === key ? "border-accent ring-accent/30 bg-accent/5" : "border-border/30";

  const otherActive = system === "other" || otherSystemNotes.trim().length > 0;

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
            <label className={`${cardBase} ${cardSelected("thefork")}`}>
              <input type="radio" name="res-system" className="sr-only" checked={system === "thefork"} onChange={() => setSystem("thefork")} />
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-lg">{copy.theforkTitle}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{copy.theforkDesc}</p>
                </div>
                <SystemSelectIndicator selected={system === "thefork"} />
              </div>
              <input
                value={theForkPropertyId}
                onChange={(e) => setTheForkPropertyId(e.target.value)}
                placeholder={copy.theforkPlaceholder}
                className="mt-4 w-full bg-background border border-border/50 rounded-lg p-3 text-sm focus:ring-2 focus:ring-accent focus:outline-none"
              />
            </label>

            <label className={`${cardBase} ${cardSelected("google")}`}>
              <input type="radio" name="res-system" className="sr-only" checked={system === "google"} onChange={() => setSystem("google")} />
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-lg">{copy.googleTitle}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{copy.googleDesc}</p>
                </div>
                <SystemSelectIndicator selected={system === "google"} />
              </div>
              <input
                type="url"
                value={googleBusinessUrl}
                onChange={(e) => setGoogleBusinessUrl(e.target.value)}
                placeholder={copy.googlePlaceholder}
                className="mt-4 w-full bg-background border border-border/50 rounded-lg p-3 text-sm focus:ring-2 focus:ring-accent focus:outline-none"
              />
            </label>

            <label className={`${cardBase} ${cardSelected("rezo")}`}>
              <input type="radio" name="res-system" className="sr-only" checked={system === "rezo"} onChange={() => setSystem("rezo")} />
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-lg">{copy.rezoTitle}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{copy.rezoDesc}</p>
                </div>
                <SystemSelectIndicator selected={system === "rezo"} />
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

            <label className={`${cardBase} ${cardSelected("checkplace")}`}>
              <input type="radio" name="res-system" className="sr-only" checked={system === "checkplace"} onChange={() => setSystem("checkplace")} />
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-lg">{copy.checkplaceTitle}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{copy.checkplaceDesc}</p>
                </div>
                <SystemSelectIndicator selected={system === "checkplace"} />
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

            <label className={`${cardBase} ${cardSelected("zenchef")}`}>
              <input type="radio" name="res-system" className="sr-only" checked={system === "zenchef"} onChange={() => setSystem("zenchef")} />
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-lg">{copy.zenchefTitle}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{copy.zenchefDesc}</p>
                </div>
                <SystemSelectIndicator selected={system === "zenchef"} />
              </div>
              <input
                value={zenchefRestaurantId}
                onChange={(e) => setZenchefRestaurantId(e.target.value)}
                placeholder={copy.zenchefPlaceholder}
                className="mt-4 w-full bg-background border border-border/50 rounded-lg p-3 text-sm focus:ring-2 focus:ring-accent focus:outline-none"
              />
            </label>

            <label className={`${cardBase} ${cardSelected("paper")} md:col-span-1`}>
              <input type="radio" name="res-system" className="sr-only" checked={system === "paper"} onChange={() => setSystem("paper")} />
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-lg">{copy.paperTitle}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{copy.paperDesc}</p>
                </div>
                <SystemSelectIndicator selected={system === "paper"} />
              </div>
            </label>

            <label
              className={`${cardBase} ${otherActive ? "border-accent ring-accent/30 bg-accent/5" : "border-border/30"} md:col-span-3`}
            >
              <input type="radio" name="res-system" className="sr-only" checked={system === "other"} onChange={() => setSystem("other")} />
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-lg">{copy.otherTitle}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{copy.otherDesc}</p>
                </div>
                <SystemSelectIndicator selected={otherActive} />
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

          <div className="rounded-2xl border border-border/30 bg-gradient-to-br from-card via-card to-muted/25 p-6 md:p-7 space-y-5 shadow-sm ring-1 ring-border/15">
            <div>
              <h4 className="font-semibold text-foreground text-lg">{copy.helpTitle}</h4>
              <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed max-w-2xl">{copy.helpDesc}</p>
            </div>
            <button
              type="button"
              onClick={copySupportEmail}
              className="group flex w-full items-center gap-4 rounded-xl border border-border/50 bg-background/90 px-4 py-3.5 text-left shadow-sm ring-1 ring-border/25 transition hover:border-accent/45 hover:bg-accent/[0.06] hover:ring-accent/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/12 text-accent transition group-hover:bg-accent/18">
                <Mail className="h-5 w-5" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground block">
                  {copy.helpEmailLabel}
                </span>
                <span className="mt-0.5 block font-mono text-sm sm:text-base font-semibold text-accent break-all select-all">
                  {copy.businessSupportEmail}
                </span>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border/60 bg-muted/30 px-3 py-2 text-xs font-semibold text-foreground transition group-hover:bg-muted/50">
                {emailCopied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-accent" aria-hidden />
                    {copy.helpEmailCopied}
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
                    {copy.helpEmailCopy}
                  </>
                )}
              </span>
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
