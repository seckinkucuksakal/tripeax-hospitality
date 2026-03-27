import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { OnboardingBottomNav } from "@/components/onboarding/OnboardingBottomNav";
import { OnboardingTopNav } from "@/components/onboarding/OnboardingTopNav";
import { Switch } from "@/components/ui/switch";

const STEP = 5;

type SeatingArea = {
  id: string;
  name: string;
  seats: string;
};

type ReservationSettings = {
  acceptReservations: boolean;
  slotInterval: "15" | "30" | "60";
  maxDirectPartySize: number;
  seatingAreas: SeatingArea[];
  averageDiningTime: string;
  depositRequired: boolean;
  depositAmount?: string;
  cancellationPolicy: string;
  waitlistEnabled: boolean;
  askSpecialOccasions: boolean;
};

type ChainState = {
  profile?: unknown;
  operatingHours?: unknown;
  menu?: unknown;
  reservationSettings?: ReservationSettings;
  reservationIntegration?: unknown;
};

function defaultSettings(): ReservationSettings {
  return {
    acceptReservations: true,
    slotInterval: "30",
    maxDirectPartySize: 8,
    seatingAreas: [
      { id: crypto.randomUUID(), name: "Indoor", seats: "40" },
      { id: crypto.randomUUID(), name: "Terrace", seats: "24" },
    ],
    averageDiningTime: "90",
    depositRequired: false,
    depositAmount: "",
    cancellationPolicy: "",
    waitlistEnabled: true,
    askSpecialOccasions: true,
  };
}

export default function RestaurantOnboardingStep5Page() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const copy = useMemo(() => t.onboardingRestaurantReservations, [t.onboardingRestaurantReservations]);

  const initialSettings = (location.state as ChainState | null)?.reservationSettings ?? defaultSettings();

  const [slotInterval, setSlotInterval] = useState<"15" | "30" | "60">(initialSettings.slotInterval);
  const [maxDirectPartySize, setMaxDirectPartySize] = useState(String(initialSettings.maxDirectPartySize));
  const [seatingAreas, setSeatingAreas] = useState<SeatingArea[]>(initialSettings.seatingAreas);
  const [averageDiningTime, setAverageDiningTime] = useState(initialSettings.averageDiningTime);
  const [depositRequired, setDepositRequired] = useState(initialSettings.depositRequired);
  const [depositAmount, setDepositAmount] = useState(() => initialSettings.depositAmount ?? "");
  const [cancellationPolicy, setCancellationPolicy] = useState(initialSettings.cancellationPolicy);
  const [waitlistEnabled, setWaitlistEnabled] = useState(initialSettings.waitlistEnabled);
  const [askSpecialOccasions, setAskSpecialOccasions] = useState(initialSettings.askSpecialOccasions);

  function updateSeatingArea(id: string, patch: Partial<SeatingArea>) {
    setSeatingAreas((prev) => prev.map((area) => (area.id === id ? { ...area, ...patch } : area)));
  }

  function addSeatingArea() {
    setSeatingAreas((prev) => [...prev, { id: crypto.randomUUID(), name: "", seats: "" }]);
  }

  function removeSeatingArea(id: string) {
    setSeatingAreas((prev) => prev.filter((area) => area.id !== id));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const prev = (location.state ?? null) as ChainState | null;
    navigate("/onboarding/restaurant/step-6", {
      state: {
        profile: prev?.profile,
        operatingHours: prev?.operatingHours,
        menu: prev?.menu,
        reservationIntegration: prev?.reservationIntegration,
        reservationSettings: {
          acceptReservations: true,
          slotInterval,
          maxDirectPartySize: Math.max(1, Number(maxDirectPartySize) || 1),
          seatingAreas: seatingAreas.map((area) => ({
            ...area,
            name: area.name.trim() || copy.defaultAreaName,
            seats: String(Math.max(1, Number(area.seats) || 1)),
          })),
          averageDiningTime,
          depositRequired,
          depositAmount: depositRequired ? depositAmount.trim() : "",
          cancellationPolicy: cancellationPolicy.trim(),
          waitlistEnabled,
          askSpecialOccasions,
        } satisfies ReservationSettings,
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
        <section className="mb-10 text-center md:text-left">
          <h1 className="text-[2rem] sm:text-[2.5rem] font-bold text-foreground leading-tight tracking-tight mb-3">
            {copy.headline}
          </h1>
          <p className="text-muted-foreground leading-relaxed">{copy.subhead}</p>
        </section>

        <form id="restaurant-reservation-settings-form" className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl bg-card ring-1 ring-border/30 p-5">
              <label className="text-xs font-bold tracking-widest text-muted-foreground uppercase">{copy.slotIntervalLabel}</label>
              <select
                value={slotInterval}
                onChange={(e) => setSlotInterval(e.target.value as "15" | "30" | "60")}
                className="mt-3 w-full bg-background border border-border/50 rounded-lg py-2.5 px-3 text-sm focus:ring-2 focus:ring-accent focus:outline-none"
              >
                <option value="15">{copy.slot15}</option>
                <option value="30">{copy.slot30}</option>
                <option value="60">{copy.slot60}</option>
              </select>
            </div>

            <div className="rounded-xl bg-card ring-1 ring-border/30 p-5">
              <label className="text-xs font-bold tracking-widest text-muted-foreground uppercase">{copy.maxPartyLabel}</label>
              <input
                type="number"
                min={1}
                value={maxDirectPartySize}
                onChange={(e) => setMaxDirectPartySize(e.target.value)}
                className="mt-3 w-full bg-background border border-border/50 rounded-lg py-2.5 px-3 text-sm focus:ring-2 focus:ring-accent focus:outline-none"
              />
              <p className="text-xs text-muted-foreground mt-2">{copy.maxPartyHint}</p>
            </div>
          </div>

          <div className="rounded-xl bg-muted/40 ring-1 ring-border/20 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-foreground">{copy.seatingAreasTitle}</h3>
              <button
                type="button"
                onClick={addSeatingArea}
                className="text-sm font-semibold text-accent hover:text-accent/80 inline-flex items-center gap-1.5"
              >
                <Plus className="h-4 w-4" />
                {copy.addSeatingArea}
              </button>
            </div>
            {seatingAreas.map((area) => (
              <div key={area.id} className="bg-card rounded-lg ring-1 ring-border/30 p-4 flex items-end gap-3">
                <div className="flex-1">
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">{copy.nameLabel}</label>
                  <input
                    value={area.name}
                    onChange={(e) => updateSeatingArea(area.id, { name: e.target.value })}
                    placeholder={copy.areaNamePlaceholder}
                    className="w-full bg-transparent border border-border/40 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-accent focus:outline-none"
                  />
                </div>
                <div className="w-24">
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">{copy.seatsLabel}</label>
                  <input
                    type="number"
                    min={1}
                    value={area.seats}
                    onChange={(e) => updateSeatingArea(area.id, { seats: e.target.value })}
                    className="w-full bg-transparent border border-border/40 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-accent focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeSeatingArea(area.id)}
                  className="text-muted-foreground hover:text-destructive p-2"
                  aria-label={copy.removeArea}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between rounded-xl bg-card ring-1 ring-border/30 p-5">
            <div>
              <h3 className="font-semibold text-foreground">{copy.avgDiningTitle}</h3>
              <p className="text-sm text-muted-foreground">{copy.avgDiningDesc}</p>
            </div>
            <select
              value={averageDiningTime}
              onChange={(e) => setAverageDiningTime(e.target.value)}
              className="bg-background border border-border/50 rounded-lg py-2 px-3 text-sm font-semibold text-accent focus:ring-2 focus:ring-accent focus:outline-none"
            >
              <option value="30">30 min</option>
              <option value="45">45 min</option>
              <option value="60">60 min</option>
              <option value="75">75 min</option>
              <option value="90">90 min</option>
              <option value="105">105 min</option>
              <option value="120">120 min</option>
              <option value="150">150 min</option>
              <option value="180">180 min</option>
              <option value="210">210 min</option>
              <option value="240">240 min</option>
              <option value="270">270 min</option>
              <option value="300">300 min</option>
            </select>
          </div>

          <div className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-xl bg-card ring-1 ring-border/30 p-5">
                <div>
                  <h3 className="font-semibold text-foreground">{copy.depositTitle}</h3>
                  <p className="text-sm text-muted-foreground">{copy.depositDesc}</p>
                </div>
                <Switch checked={depositRequired} onCheckedChange={setDepositRequired} className="data-[state=checked]:bg-accent" />
              </div>

              {depositRequired ? (
                <div className="rounded-xl bg-card ring-1 ring-border/30 p-5 space-y-3">
                  <label className="text-xs font-bold tracking-widest text-muted-foreground uppercase block">
                    {copy.depositAmountLabel}
                  </label>
                  <input
                    type="text"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder={copy.depositAmountPlaceholder}
                    className="w-full bg-background border border-border/50 rounded-lg py-2.5 px-3 text-sm focus:ring-2 focus:ring-accent focus:outline-none"
                    autoComplete="off"
                  />
                  <p className="text-xs text-muted-foreground leading-relaxed">{copy.depositPaymentNote}</p>
                </div>
              ) : null}
            </div>

            <div className="rounded-xl bg-card ring-1 ring-border/30 p-5">
              <label className="text-xs font-bold tracking-widest text-muted-foreground uppercase">{copy.cancellationLabel}</label>
              <textarea
                value={cancellationPolicy}
                onChange={(e) => setCancellationPolicy(e.target.value)}
                rows={4}
                placeholder={copy.cancellationPlaceholder}
                className="mt-3 w-full bg-background border border-border/50 rounded-lg py-2.5 px-3 text-sm focus:ring-2 focus:ring-accent focus:outline-none resize-none"
              />
            </div>

            <div className="flex items-center justify-between rounded-xl bg-card ring-1 ring-border/30 p-5">
              <div className="pr-6">
                <h3 className="font-semibold text-foreground">{copy.waitlistTitle}</h3>
                <p className="text-sm text-muted-foreground">{copy.waitlistDesc}</p>
              </div>
              <Switch checked={waitlistEnabled} onCheckedChange={setWaitlistEnabled} className="data-[state=checked]:bg-accent" />
            </div>

            <div className="flex items-center justify-between rounded-xl bg-card ring-1 ring-border/30 p-5">
              <div className="pr-6">
                <h3 className="font-semibold text-foreground">{copy.specialOccasionsTitle}</h3>
                <p className="text-sm text-muted-foreground">{copy.specialOccasionsDesc}</p>
              </div>
              <Switch checked={askSpecialOccasions} onCheckedChange={setAskSpecialOccasions} className="data-[state=checked]:bg-accent" />
            </div>
          </div>
        </form>
      </main>

      <OnboardingBottomNav
        backLabel={copy.back}
        continueLabel={copy.continue}
        onBack={() => navigate("/onboarding/restaurant/step-4", { state: location.state })}
        formId="restaurant-reservation-settings-form"
      />
    </motion.div>
  );
}
