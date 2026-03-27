import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Globe, Lightbulb, ReceiptText, Store } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { OnboardingBottomNav } from "@/components/onboarding/OnboardingBottomNav";
import { OnboardingTopNav } from "@/components/onboarding/OnboardingTopNav";

const STEP = 5;

type Strategy = "direct_website" | "marketplace" | "manual_invoice";
type HoldDuration = "15m" | "30m" | "1h" | "2h";

type BookingFinalizationPayload = {
  strategy: Strategy;
  baseBookingUrl: string;
  holdDuration: HoldDuration;
  finalScript: string;
};

type ChainState = {
  profile?: unknown;
  hotelHours?: unknown;
  roomInventory?: unknown;
  bookingFinalization?: BookingFinalizationPayload;
};

export default function HotelOnboardingStep5Page() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const copy = useMemo(() => t.onboardingHotelBookingFinalization, [t.onboardingHotelBookingFinalization]);

  const initial = (location.state as ChainState | null)?.bookingFinalization;
  const [strategy, setStrategy] = useState<Strategy>(initial?.strategy ?? "direct_website");
  const [baseBookingUrl, setBaseBookingUrl] = useState(initial?.baseBookingUrl ?? "");
  const [holdDuration, setHoldDuration] = useState<HoldDuration>(initial?.holdDuration ?? "30m");
  const [finalScript, setFinalScript] = useState(
    initial?.finalScript ?? copy.finalScriptDefault,
  );

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const prev = (location.state ?? null) as ChainState | null;
    navigate("/onboarding/hotel/step-6", {
      state: {
        profile: prev?.profile,
        hotelHours: prev?.hotelHours,
        roomInventory: prev?.roomInventory,
        bookingFinalization: {
          strategy,
          baseBookingUrl: baseBookingUrl.trim(),
          holdDuration,
          finalScript: finalScript.trim(),
        } satisfies BookingFinalizationPayload,
      },
    });
  }

  const strategyCards: {
    key: Strategy;
    title: string;
    desc: string;
    icon: JSX.Element;
  }[] = [
    { key: "direct_website", title: copy.directTitle, desc: copy.directDesc, icon: <Globe className="h-5 w-5" /> },
    { key: "marketplace", title: copy.marketplaceTitle, desc: copy.marketplaceDesc, icon: <Store className="h-5 w-5" /> },
    { key: "manual_invoice", title: copy.manualTitle, desc: copy.manualDesc, icon: <ReceiptText className="h-5 w-5" /> },
  ];

  return (
    <motion.div
      className="min-h-screen bg-background text-foreground"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <OnboardingTopNav step={STEP} />

      <main className="pt-6 pb-32 px-4 max-w-5xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{copy.headline}</h1>
          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">{copy.subhead}</p>
        </header>

        <form id="hotel-booking-finalization-form" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-8">
              <section>
                <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6">{copy.strategyTitle}</h2>
                <div className="grid gap-4">
                  {strategyCards.map((item) => {
                    const selected = strategy === item.key;
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => setStrategy(item.key)}
                        className={`p-6 rounded-xl text-left border-2 transition-all ${
                          selected
                            ? "bg-card border-accent ring-4 ring-accent/10"
                            : "bg-card border-transparent hover:border-border"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex gap-4">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${selected ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground"}`}>
                              {item.icon}
                            </div>
                            <div>
                              <h3 className="font-bold">{item.title}</h3>
                              <p className="text-sm text-muted-foreground mt-1 leading-snug">{item.desc}</p>
                            </div>
                          </div>
                          <div className={`w-5 h-5 rounded-full ${selected ? "border-4 border-accent bg-white" : "border-2 border-border"}`} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>

              <section className="p-8 rounded-xl bg-muted relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-accent" />
                <h2 className="text-lg font-bold mb-6">{copy.linkConfigTitle}</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">{copy.baseUrlLabel}</label>
                    <input
                      value={baseBookingUrl}
                      onChange={(e) => setBaseBookingUrl(e.target.value)}
                      placeholder={copy.baseUrlPlaceholder}
                      className="w-full bg-card border border-border/30 focus:ring-2 focus:ring-accent rounded-lg py-3 px-4 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">{copy.urlParamsLabel}</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-bold rounded-full">checkin</span>
                      <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-bold rounded-full">checkout</span>
                      <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-bold rounded-full">adults</span>
                    </div>
                    <p className="text-xs text-muted-foreground italic">{copy.urlParamsHint}</p>
                  </div>
                </div>
              </section>
            </div>

            <div className="lg:col-span-5 space-y-8">
              <section className="bg-card p-8 rounded-xl ring-1 ring-border/20">
                <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6">{copy.secureLogicTitle}</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">{copy.holdLabel}</label>
                    <select
                      value={holdDuration}
                      onChange={(e) => setHoldDuration(e.target.value as HoldDuration)}
                      className="w-full bg-muted border border-border/20 focus:ring-2 focus:ring-accent rounded-lg py-3 px-4 font-medium"
                    >
                      <option value="15m">{copy.hold15m}</option>
                      <option value="30m">{copy.hold30m}</option>
                      <option value="1h">{copy.hold1h}</option>
                      <option value="2h">{copy.hold2h}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">{copy.finalScriptLabel}</label>
                    <textarea
                      value={finalScript}
                      onChange={(e) => setFinalScript(e.target.value)}
                      rows={4}
                      className="w-full bg-muted border border-border/20 focus:ring-2 focus:ring-accent rounded-lg py-3 px-4 text-sm"
                    />
                    <div className="mt-2 text-[10px] text-accent font-bold uppercase tracking-wider">{copy.finalScriptHint}</div>
                  </div>
                </div>
              </section>

              <div className="relative bg-card p-6 rounded-lg overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent" />
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-accent mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-tight">{copy.insightEyebrow}</p>
                    <p className="text-sm leading-snug">{copy.insightText}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>

      <OnboardingBottomNav
        backLabel={copy.back}
        continueLabel={copy.continue}
        onBack={() => navigate("/onboarding/hotel/step-4", { state: location.state })}
        formId="hotel-booking-finalization-form"
      />
    </motion.div>
  );
}
