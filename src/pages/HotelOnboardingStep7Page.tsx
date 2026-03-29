import type { FormEvent, MouseEvent, ReactNode } from "react";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, ExternalLink, Info, Lock, Zap } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { OnboardingBottomNav } from "@/components/onboarding/OnboardingBottomNav";
import { OnboardingTopNav } from "@/components/onboarding/OnboardingTopNav";
import { SystemSelectIndicator } from "@/components/onboarding/SystemSelectIndicator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const STEP = 7;

type SystemKey = "cloudbeds" | "mews" | "hotelrunner" | "booking" | "manual";

export type HotelPmsIntegrationPayload = {
  systems: SystemKey[];
  cloudbedsApiKey: string;
  mewsAccessToken: string;
  hotelrunnerUsername: string;
  hotelrunnerPassword: string;
  bookingPropertyId: string;
  otherSystemNotes: string;
};

type CommonQuestionsPayload = {
  cells: Record<string, { answer: string; proactive: boolean }>;
  customQuestions: Array<{ id: string; tab: string; question: string; answer: string }>;
};

type ChainState = {
  profile?: unknown;
  hotelHours?: unknown;
  roomInventory?: unknown;
  bookingFinalization?: unknown;
  commonQuestions?: CommonQuestionsPayload;
  hotelPmsIntegration?: HotelPmsIntegrationPayload;
  aiVoicePersona?: unknown;
};

function isSystemKey(v: unknown): v is SystemKey {
  return (
    v === "cloudbeds" ||
    v === "mews" ||
    v === "hotelrunner" ||
    v === "booking" ||
    v === "manual"
  );
}

/** Hydrates from `systems` or legacy single `system`; default first visit: Cloudbeds selected. */
function normalizeSelectedSystems(saved: unknown): SystemKey[] {
  if (!saved || typeof saved !== "object") return ["cloudbeds"];
  const o = saved as Record<string, unknown>;
  if (Array.isArray(o.systems)) {
    return [...new Set(o.systems.filter(isSystemKey))];
  }
  if (isSystemKey(o.system)) return [o.system];
  return ["cloudbeds"];
}

function DirectPaymentBadge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-1 text-[10px] font-bold text-accent">
      <Zap className="h-3 w-3" aria-hidden />
      {children}
    </span>
  );
}

export default function HotelOnboardingStep7Page() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const copy = useMemo(() => t.onboardingHotelPmsIntegration, [t.onboardingHotelPmsIntegration]);

  const initial = (location.state as ChainState | null)?.hotelPmsIntegration;

  const [selectedSystems, setSelectedSystems] = useState<SystemKey[]>(() => normalizeSelectedSystems(initial));
  const [cloudbedsApiKey, setCloudbedsApiKey] = useState(initial?.cloudbedsApiKey ?? "");
  const [mewsAccessToken, setMewsAccessToken] = useState(initial?.mewsAccessToken ?? "");
  const [hotelrunnerUsername, setHotelrunnerUsername] = useState(initial?.hotelrunnerUsername ?? "");
  const [hotelrunnerPassword, setHotelrunnerPassword] = useState(initial?.hotelrunnerPassword ?? "");
  const [bookingPropertyId, setBookingPropertyId] = useState(initial?.bookingPropertyId ?? "");
  const [otherSystemNotes, setOtherSystemNotes] = useState(initial?.otherSystemNotes ?? "");
  const [wipModalOpen, setWipModalOpen] = useState(false);

  const otherFilled = otherSystemNotes.trim().length > 0;

  function toggleSystem(key: SystemKey) {
    setSelectedSystems((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  }

  function isCardSelected(key: SystemKey) {
    return selectedSystems.includes(key);
  }

  function openWipModal(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setWipModalOpen(true);
  }

  function cardClass(selected: boolean) {
    return `rounded-xl p-6 text-left border-2 transition-all duration-300 ${
      selected
        ? "bg-card border-accent ring-4 ring-accent/10 shadow-lg shadow-accent/15"
        : "bg-muted/25 border-border/70 shadow-sm ring-1 ring-border/30 hover:border-border hover:bg-muted/40 hover:shadow-md"
    }`;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const prev = (location.state ?? null) as ChainState | null;
    const hotelPmsIntegration: HotelPmsIntegrationPayload = {
      systems: selectedSystems,
      cloudbedsApiKey: cloudbedsApiKey.trim(),
      mewsAccessToken: mewsAccessToken.trim(),
      hotelrunnerUsername: hotelrunnerUsername.trim(),
      hotelrunnerPassword: hotelrunnerPassword.trim(),
      bookingPropertyId: bookingPropertyId.trim(),
      otherSystemNotes: otherSystemNotes.trim(),
    };
    navigate("/onboarding/hotel/step-8", {
      state: {
        profile: prev?.profile,
        hotelHours: prev?.hotelHours,
        roomInventory: prev?.roomInventory,
        bookingFinalization: prev?.bookingFinalization,
        commonQuestions: prev?.commonQuestions,
        hotelPmsIntegration,
        aiVoicePersona: prev?.aiVoicePersona,
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

      <Dialog open={wipModalOpen} onOpenChange={setWipModalOpen}>
        <DialogContent className="sm:max-w-md [&>button]:hidden text-center">
          <DialogHeader className="sm:text-center">
            <DialogTitle>{copy.wipModalTitle}</DialogTitle>
            <DialogDescription className="text-base pt-2">{copy.wipModalBody}</DialogDescription>
          </DialogHeader>
          <div className="flex justify-center pt-4">
            <button
              type="button"
              onClick={() => setWipModalOpen(false)}
              className="px-10 py-3 rounded-lg bg-accent text-accent-foreground font-bold text-sm shadow-lg shadow-accent/20 hover:bg-accent/90 transition-colors active:scale-[0.98]"
            >
              {copy.wipModalOk}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <main className="pt-6 pb-32 px-4 max-w-5xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">{copy.headline}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">{copy.subhead}</p>
        </header>

        <form id="hotel-pms-integration-form" onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              type="button"
              onClick={() => toggleSystem("cloudbeds")}
              className={cardClass(isCardSelected("cloudbeds"))}
            >
              <div className="flex justify-between items-start gap-3 mb-4">
                <DirectPaymentBadge>{copy.badgeDirectPayment}</DirectPaymentBadge>
                <SystemSelectIndicator selected={isCardSelected("cloudbeds")} />
              </div>
              <h3 className="font-semibold text-xl mb-1">{copy.cloudbedsTitle}</h3>
              <p className="text-sm text-muted-foreground mb-6">{copy.cloudbedsSubtitle}</p>
              <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">{copy.cloudbedsApiKeyLabel}</label>
                  <input
                    type="password"
                    autoComplete="off"
                    value={cloudbedsApiKey}
                    onChange={(e) => setCloudbedsApiKey(e.target.value)}
                    placeholder={copy.cloudbedsApiKeyPlaceholder}
                    className="w-full bg-background border border-border/80 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={openWipModal}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
                >
                  {copy.cloudbedsHelpLink}
                  <ExternalLink className="h-3.5 w-3.5" />
                </button>
              </div>
            </button>

            <button type="button" onClick={() => toggleSystem("mews")} className={cardClass(isCardSelected("mews"))}>
              <div className="flex justify-between items-start gap-3 mb-4">
                <DirectPaymentBadge>{copy.badgeDirectPayment}</DirectPaymentBadge>
                <SystemSelectIndicator selected={isCardSelected("mews")} />
              </div>
              <h3 className="font-semibold text-xl mb-1">{copy.mewsTitle}</h3>
              <p className="text-sm text-muted-foreground mb-6">{copy.mewsSubtitle}</p>
              <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">{copy.mewsTokenLabel}</label>
                  <input
                    type="text"
                    autoComplete="off"
                    value={mewsAccessToken}
                    onChange={(e) => setMewsAccessToken(e.target.value)}
                    placeholder={copy.mewsTokenPlaceholder}
                    className="w-full bg-background border border-border/80 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={openWipModal}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
                >
                  {copy.mewsGuideLink}
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </button>

            <button type="button" onClick={() => toggleSystem("hotelrunner")} className={cardClass(isCardSelected("hotelrunner"))}>
              <div className="flex justify-between items-start gap-3 mb-4">
                <DirectPaymentBadge>{copy.badgeDirectPayment}</DirectPaymentBadge>
                <SystemSelectIndicator selected={isCardSelected("hotelrunner")} />
              </div>
              <h3 className="font-semibold text-xl mb-1">{copy.hotelrunnerTitle}</h3>
              <p className="text-sm text-muted-foreground mb-6">{copy.hotelrunnerSubtitle}</p>
              <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
                <input
                  type="text"
                  autoComplete="username"
                  value={hotelrunnerUsername}
                  onChange={(e) => setHotelrunnerUsername(e.target.value)}
                  placeholder={copy.hotelrunnerUserPlaceholder}
                  className="w-full bg-background border border-border/80 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                />
                <input
                  type="password"
                  autoComplete="current-password"
                  value={hotelrunnerPassword}
                  onChange={(e) => setHotelrunnerPassword(e.target.value)}
                  placeholder={copy.hotelrunnerPassPlaceholder}
                  className="w-full bg-background border border-border/80 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                />
                <div className="inline-flex items-center gap-2 text-[10px] font-bold text-muted-foreground bg-muted px-2 py-1 rounded">
                  <Lock className="h-3.5 w-3.5" aria-hidden />
                  {copy.encryptedNote}
                </div>
              </div>
            </button>

            <button type="button" onClick={() => toggleSystem("booking")} className={cardClass(isCardSelected("booking"))}>
              <div className="flex justify-end items-start mb-4">
                <SystemSelectIndicator selected={isCardSelected("booking")} />
              </div>
              <h3 className="font-semibold text-xl mb-1">{copy.bookingTitle}</h3>
              <p className="text-sm text-muted-foreground mb-6">{copy.bookingSubtitle}</p>
              <div onClick={(e) => e.stopPropagation()}>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">{copy.bookingPropertyLabel}</label>
                <input
                  type="text"
                  value={bookingPropertyId}
                  onChange={(e) => setBookingPropertyId(e.target.value)}
                  placeholder={copy.bookingPropertyPlaceholder}
                  className="w-full bg-background border border-border/80 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                />
              </div>
            </button>

            <div
              className="rounded-xl p-6 border-2 border-border/60 bg-muted/35 opacity-80 shadow-sm ring-1 ring-border/25 cursor-not-allowed md:col-span-1"
              aria-disabled
            >
              <div className="flex justify-end items-start mb-4">
                <SystemSelectIndicator selected={false} disabled />
              </div>
              <h3 className="font-semibold text-xl mb-1 text-muted-foreground">{copy.operaTitle}</h3>
              <p className="text-sm text-muted-foreground mb-4">{copy.operaSubtitle}</p>
              <div className="border-l-4 border-accent pl-3 py-3 bg-card rounded-r-lg">
                <p className="text-xs text-muted-foreground leading-relaxed">{copy.operaDisabledMessage}</p>
              </div>
            </div>

            <button type="button" onClick={() => toggleSystem("manual")} className={cardClass(isCardSelected("manual"))}>
              <div className="flex justify-end items-start mb-4">
                <SystemSelectIndicator selected={isCardSelected("manual")} />
              </div>
              <h3 className="font-semibold text-xl mb-1">{copy.manualTitle}</h3>
              <p className="text-sm text-muted-foreground mb-6">{copy.manualSubtitle}</p>
              <div className="mt-auto bg-accent/5 p-4 rounded-lg flex gap-3 items-start">
                <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">{copy.manualHint}</p>
              </div>
            </button>
          </div>

          <div
            className={`rounded-xl p-6 border-2 transition-all ${
              otherFilled
                ? "bg-card border-accent ring-4 ring-accent/10 shadow-lg shadow-accent/15"
                : "border-border/70 bg-muted/25 shadow-sm ring-1 ring-border/30 hover:border-border hover:bg-muted/40 hover:shadow-md"
            }`}
          >
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-start gap-4">
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-xl mb-1">{copy.otherTitle}</h3>
                  <p className="text-sm text-muted-foreground">{copy.otherSubtitle}</p>
                </div>
                <SystemSelectIndicator selected={otherFilled} />
              </div>
              <textarea
                value={otherSystemNotes}
                onChange={(e) => setOtherSystemNotes(e.target.value)}
                placeholder={copy.otherPlaceholder}
                rows={2}
                className="w-full bg-background border border-border/80 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none resize-none"
              />
            </div>
          </div>

          <div className="flex w-full items-start gap-3 p-4 rounded-xl bg-muted/50 border border-border/30">
            <Info className="h-5 w-5 text-accent shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground leading-relaxed">{copy.footerHint}</p>
          </div>
        </form>
      </main>

      <OnboardingBottomNav
        backLabel={copy.back}
        continueLabel={copy.continue}
        onBack={() => navigate("/onboarding/hotel/step-6", { state: location.state })}
        formId="hotel-pms-integration-form"
      />
    </motion.div>
  );
}
