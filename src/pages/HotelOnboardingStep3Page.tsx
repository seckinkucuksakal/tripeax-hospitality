import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ConciergeBell, Lightbulb, MoonStar, Sunrise, Utensils } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { OnboardingBottomNav } from "@/components/onboarding/OnboardingBottomNav";
import { OnboardingTopNav } from "@/components/onboarding/OnboardingTopNav";
import { Switch } from "@/components/ui/switch";

const STEP = 3;

type HotelHoursPayload = {
  checkInTime: string;
  checkOutTime: string;
  has24hFrontDesk: boolean;
  frontDeskOpen: string;
  frontDeskClose: string;
  earlyCheckInAvailable: boolean;
  earlyCheckInFrom: string;
  earlyCheckInCharge: "free" | "percent_25" | "fixed";
  lateCheckOutAvailable: boolean;
  addRestaurantHours: boolean;
};

type ChainState = {
  profile?: unknown;
  hotelHours?: HotelHoursPayload;
  roomInventory?: unknown;
};

function defaultHours(): HotelHoursPayload {
  return {
    checkInTime: "15:00",
    checkOutTime: "11:00",
    has24hFrontDesk: false,
    frontDeskOpen: "08:00",
    frontDeskClose: "22:00",
    earlyCheckInAvailable: false,
    earlyCheckInFrom: "10:00",
    earlyCheckInCharge: "free",
    lateCheckOutAvailable: false,
    addRestaurantHours: false,
  };
}

export default function HotelOnboardingStep3Page() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const copy = useMemo(() => t.onboardingHotelHours, [t.onboardingHotelHours]);

  const initial = (location.state as ChainState | null)?.hotelHours ?? defaultHours();

  const [checkInTime, setCheckInTime] = useState(initial.checkInTime);
  const [checkOutTime, setCheckOutTime] = useState(initial.checkOutTime);
  const [has24hFrontDesk, setHas24hFrontDesk] = useState(initial.has24hFrontDesk);
  const [frontDeskOpen, setFrontDeskOpen] = useState(initial.frontDeskOpen);
  const [frontDeskClose, setFrontDeskClose] = useState(initial.frontDeskClose);
  const [earlyCheckInAvailable, setEarlyCheckInAvailable] = useState(initial.earlyCheckInAvailable);
  const [earlyCheckInFrom, setEarlyCheckInFrom] = useState(initial.earlyCheckInFrom);
  const [earlyCheckInCharge, setEarlyCheckInCharge] = useState<"free" | "percent_25" | "fixed">(initial.earlyCheckInCharge);
  const [lateCheckOutAvailable, setLateCheckOutAvailable] = useState(initial.lateCheckOutAvailable);
  const [addRestaurantHours, setAddRestaurantHours] = useState(initial.addRestaurantHours);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const prev = (location.state ?? null) as ChainState | null;
    navigate("/onboarding/hotel/step-4", {
      state: {
        profile: prev?.profile,
        roomInventory: prev?.roomInventory,
        hotelHours: {
          checkInTime,
          checkOutTime,
          has24hFrontDesk,
          frontDeskOpen,
          frontDeskClose,
          earlyCheckInAvailable,
          earlyCheckInFrom,
          earlyCheckInCharge,
          lateCheckOutAvailable,
          addRestaurantHours,
        } satisfies HotelHoursPayload,
      },
    });
  }

  return (
    <motion.div
      className="min-h-screen bg-background text-foreground"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <OnboardingTopNav step={STEP} />

      <main className="px-6 py-8 max-w-[640px] mx-auto pb-32">
        <section className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight">{copy.headline}</h1>
          <p className="text-muted-foreground mt-3">{copy.subhead}</p>
        </section>

        <form id="hotel-hours-form" className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-card p-5 rounded-xl ring-1 ring-border/30">
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{copy.checkInLabel}</label>
              <input
                type="time"
                value={checkInTime}
                onChange={(e) => setCheckInTime(e.target.value)}
                className="w-full bg-background rounded-lg border border-border/40 px-4 py-3 font-semibold"
              />
            </div>
            <div className="bg-card p-5 rounded-xl ring-1 ring-border/30">
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{copy.checkOutLabel}</label>
              <input
                type="time"
                value={checkOutTime}
                onChange={(e) => setCheckOutTime(e.target.value)}
                className="w-full bg-background rounded-lg border border-border/40 px-4 py-3 font-semibold"
              />
            </div>
          </div>

          <div className="bg-card rounded-xl ring-1 ring-border/25 divide-y divide-border/20">
            <div className="p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-full bg-accent/10 text-accent flex items-center justify-center">
                  <ConciergeBell className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="font-semibold">{copy.frontDesk24Title}</h3>
                  <p className="text-xs text-muted-foreground">{copy.frontDesk24Desc}</p>
                </div>
              </div>
              <Switch checked={has24hFrontDesk} onCheckedChange={setHas24hFrontDesk} className="data-[state=checked]:bg-accent" />
            </div>

            {!has24hFrontDesk ? (
              <div className="p-5 pt-4 bg-muted/30">
                <p className="text-xs text-muted-foreground mb-3">{copy.frontDeskAvailabilityHint}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{copy.openingTimeLabel}</label>
                    <input
                      type="time"
                      value={frontDeskOpen}
                      onChange={(e) => setFrontDeskOpen(e.target.value)}
                      className="mt-2 w-full bg-background rounded-lg border border-border/40 px-3 py-2.5 text-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{copy.closingTimeLabel}</label>
                    <input
                      type="time"
                      value={frontDeskClose}
                      onChange={(e) => setFrontDeskClose(e.target.value)}
                      className="mt-2 w-full bg-background rounded-lg border border-border/40 px-3 py-2.5 text-sm font-medium"
                    />
                  </div>
                </div>
              </div>
            ) : null}

            <div className="p-5">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-full bg-accent/10 text-accent flex items-center justify-center">
                    <Sunrise className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="font-semibold">{copy.earlyCheckInTitle}</h3>
                    <p className="text-xs text-muted-foreground">{copy.earlyCheckInDesc}</p>
                  </div>
                </div>
                <Switch
                  checked={earlyCheckInAvailable}
                  onCheckedChange={setEarlyCheckInAvailable}
                  className="data-[state=checked]:bg-accent"
                />
              </div>
              {earlyCheckInAvailable ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">{copy.earlyFromLabel}</label>
                    <input
                      type="time"
                      value={earlyCheckInFrom}
                      onChange={(e) => setEarlyCheckInFrom(e.target.value)}
                      className="mt-2 w-full bg-background rounded-lg border border-border/40 px-3 py-2.5 text-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">{copy.extraChargeLabel}</label>
                    <select
                      value={earlyCheckInCharge}
                      onChange={(e) => setEarlyCheckInCharge(e.target.value as "free" | "percent_25" | "fixed")}
                      className="mt-2 w-full bg-background rounded-lg border border-border/40 px-3 py-2.5 text-sm font-medium"
                    >
                      <option value="free">{copy.chargeFree}</option>
                      <option value="percent_25">{copy.chargePercent}</option>
                      <option value="fixed">{copy.chargeFixed}</option>
                    </select>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-full bg-accent/10 text-accent flex items-center justify-center">
                  <MoonStar className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="font-semibold">{copy.lateCheckOutTitle}</h3>
                  <p className="text-xs text-muted-foreground">{copy.lateCheckOutDesc}</p>
                </div>
              </div>
              <Switch checked={lateCheckOutAvailable} onCheckedChange={setLateCheckOutAvailable} className="data-[state=checked]:bg-accent" />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setAddRestaurantHours((v) => !v)}
            className={`w-full p-5 rounded-xl border-2 border-dashed flex items-center justify-center gap-3 transition-all ${
              addRestaurantHours ? "border-accent/50 bg-accent/5 text-accent" : "border-border/40 text-accent hover:bg-accent/5"
            }`}
          >
            <Utensils className="h-4 w-4" />
            <span className="font-semibold">{copy.addRestaurantHours}</span>
          </button>

          <div className="flex gap-3 p-4 rounded-xl bg-card ring-1 ring-border/30 overflow-hidden relative">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent" />
            <Lightbulb className="h-4 w-4 text-accent mt-0.5 ml-2 shrink-0" />
            <div>
              <p className="text-sm font-medium">{copy.tipTitle}</p>
              <p className="text-xs text-muted-foreground mt-1">{copy.tipDesc}</p>
            </div>
          </div>
        </form>
      </main>

      <OnboardingBottomNav
        backLabel={copy.back}
        continueLabel={copy.continue}
        onBack={() => navigate("/onboarding/business-profile/hotel")}
        formId="hotel-hours-form"
      />
    </motion.div>
  );
}
