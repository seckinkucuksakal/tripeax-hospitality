import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CalendarClock, UtensilsCrossed } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { generateTimeOptions30 } from "@/lib/generateTimeOptions";
import { OnboardingBottomNav } from "@/components/onboarding/OnboardingBottomNav";
import { OnboardingTopNav } from "@/components/onboarding/OnboardingTopNav";
import { Switch } from "@/components/ui/switch";

const STEP = 3;

const DAY_KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
type DayKey = (typeof DAY_KEYS)[number];

type DaySchedule = {
  enabled: boolean;
  open: string;
  close: string;
  split: boolean;
  breakfastEnabled: boolean;
  breakfastOpen: string;
  breakfastClose: string;
  lunchEnabled: boolean;
  dinnerEnabled: boolean;
  dinnerOpen: string;
  dinnerClose: string;
};

function defaultDay(enabled: boolean): DaySchedule {
  return {
    enabled,
    open: "11:00",
    close: "22:00",
    split: false,
    breakfastEnabled: true,
    breakfastOpen: "07:00",
    breakfastClose: "11:00",
    lunchEnabled: true,
    dinnerEnabled: true,
    dinnerOpen: "18:00",
    dinnerClose: "23:00",
  };
}

function normalizeDaySchedule(raw: Partial<DaySchedule> | undefined): DaySchedule {
  if (!raw) return defaultDay(true);
  const en = raw.enabled ?? true;
  const base = defaultDay(en);
  return {
    enabled: en,
    open: raw.open ?? base.open,
    close: raw.close ?? base.close,
    split: raw.split ?? false,
    breakfastEnabled: raw.breakfastEnabled ?? true,
    breakfastOpen: raw.breakfastOpen ?? base.breakfastOpen,
    breakfastClose: raw.breakfastClose ?? base.breakfastClose,
    lunchEnabled: raw.lunchEnabled ?? true,
    dinnerEnabled: raw.dinnerEnabled ?? true,
    dinnerOpen: raw.dinnerOpen ?? base.dinnerOpen,
    dinnerClose: raw.dinnerClose ?? base.dinnerClose,
  };
}

const KITCHEN_KEYS = ["same", "m15", "m30", "m45", "h1"] as const;
type KitchenKey = (typeof KITCHEN_KEYS)[number];

const RESV_KEYS = ["h0_5", "h1", "h1_5", "h2", "h3", "same_close"] as const;
type ResvKey = (typeof RESV_KEYS)[number];

type OperatingHoursPayload = {
  schedule: Record<DayKey, DaySchedule>;
  kitchenLastOrder: KitchenKey;
  lastReservation: ResvKey;
};

function defaultSchedule(): Record<DayKey, DaySchedule> {
  return {
    mon: defaultDay(true),
    tue: defaultDay(true),
    wed: defaultDay(true),
    thu: defaultDay(true),
    fri: defaultDay(true),
    sat: defaultDay(true),
    sun: defaultDay(false),
  };
}

function hoursFromState(state: unknown): OperatingHoursPayload | null {
  const s = state as { operatingHours?: OperatingHoursPayload } | null;
  if (!s?.operatingHours?.schedule) return null;
  return s.operatingHours;
}

export default function RestaurantOnboardingStep3Page() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const copy = useMemo(() => t.onboardingRestaurantHours, [t.onboardingRestaurantHours]);

  const timeOptions = useMemo(() => generateTimeOptions30(), []);

  const [schedule, setSchedule] = useState<Record<DayKey, DaySchedule>>(() => {
    const p = hoursFromState(location.state);
    if (p?.schedule) {
      return Object.fromEntries(DAY_KEYS.map((k) => [k, normalizeDaySchedule(p.schedule[k])])) as Record<
        DayKey,
        DaySchedule
      >;
    }
    return defaultSchedule();
  });

  const [kitchenLastOrder, setKitchenLastOrder] = useState<KitchenKey>(() => {
    const p = hoursFromState(location.state);
    const k = p?.kitchenLastOrder;
    return k && (KITCHEN_KEYS as readonly string[]).includes(k) ? k : "same";
  });

  const [lastReservation, setLastReservation] = useState<ResvKey>(() => {
    const p = hoursFromState(location.state);
    const k = p?.lastReservation;
    return k && (RESV_KEYS as readonly string[]).includes(k) ? k : "h1";
  });

  function patchDay(key: DayKey, patch: Partial<DaySchedule>) {
    setSchedule((prev) => {
      const next = { ...prev[key], ...patch };
      if (patch.enabled === false) next.split = false;
      return { ...prev, [key]: next };
    });
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const profile = (location.state as { profile?: unknown } | null)?.profile;
    navigate("/onboarding/restaurant/step-4", {
      state: {
        profile,
        operatingHours: {
          schedule,
          kitchenLastOrder,
          lastReservation,
        },
      },
    });
  }

  const kitchenOptions: { key: KitchenKey; label: string }[] = [
    { key: "same", label: copy.kitchenSameClose },
    { key: "m15", label: copy.kitchenM15 },
    { key: "m30", label: copy.kitchenM30 },
    { key: "m45", label: copy.kitchenM45 },
    { key: "h1", label: copy.kitchenH1 },
  ];

  const resvOptions: { key: ResvKey; label: string }[] = [
    { key: "h0_5", label: copy.resvH0_5Before },
    { key: "h1", label: copy.resvH1Before },
    { key: "h1_5", label: copy.resvH1_5Before },
    { key: "h2", label: copy.resvH2Before },
    { key: "h3", label: copy.resvH3Before },
    { key: "same_close", label: copy.resvSameClose },
  ];

  const selectClass =
    "w-full bg-background border border-border/60 rounded-lg py-2.5 px-3 text-sm font-medium focus:ring-2 focus:ring-accent focus:outline-none";

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
          <p className="text-muted-foreground leading-relaxed max-w-lg">{copy.subhead}</p>
        </section>

        <form id="restaurant-hours-form" className="space-y-8" onSubmit={handleSubmit}>
          <div className="bg-card rounded-xl shadow-sm ring-1 ring-border/30 overflow-hidden divide-y divide-border/40">
            {DAY_KEYS.map((key) => {
              const sch = schedule[key];
              const dayLabel = copy.days[key];
              return (
                <div key={key} className="p-4 sm:p-5 hover:bg-muted/20 transition-colors">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <span className="font-semibold text-foreground min-w-[2.5rem]">{dayLabel}</span>
                    <Switch
                      checked={sch.enabled}
                      onCheckedChange={(v) => patchDay(key, { enabled: v })}
                      className="data-[state=checked]:bg-accent shrink-0"
                    />
                  </div>

                  {sch.enabled ? (
                    <div className="space-y-4">
                      {!sch.split ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-muted-foreground mb-1 block">
                              {copy.openLabel}
                            </span>
                            <select
                              className={selectClass}
                              value={sch.open}
                              onChange={(e) => patchDay(key, { open: e.target.value })}
                            >
                              {timeOptions.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-bold text-muted-foreground mb-1 block">
                              {copy.closeLabel}
                            </span>
                            <select
                              className={selectClass}
                              value={sch.close}
                              onChange={(e) => patchDay(key, { close: e.target.value })}
                            >
                              {timeOptions.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ) : null}

                      <div className="flex items-center justify-between gap-4">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground">{copy.splitLabel}</span>
                        <Switch
                          checked={sch.split}
                          onCheckedChange={(v) => patchDay(key, { split: v })}
                          className="data-[state=checked]:bg-accent shrink-0"
                        />
                      </div>

                      {sch.split ? (
                        <div className="space-y-5 pt-4 border-t border-dashed border-border/40">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between gap-4">
                              <span className="text-[10px] uppercase font-bold text-muted-foreground">
                                {copy.mealBreakfast}
                              </span>
                              <Switch
                                checked={sch.breakfastEnabled}
                                onCheckedChange={(v) => patchDay(key, { breakfastEnabled: v })}
                                className="data-[state=checked]:bg-accent shrink-0"
                              />
                            </div>
                            {sch.breakfastEnabled ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <span className="text-[10px] uppercase font-bold text-muted-foreground mb-1 block">
                                    {copy.breakfastStart}
                                  </span>
                                  <select
                                    className={selectClass}
                                    value={sch.breakfastOpen}
                                    onChange={(e) => patchDay(key, { breakfastOpen: e.target.value })}
                                  >
                                    {timeOptions.map((opt) => (
                                      <option key={opt} value={opt}>
                                        {opt}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <div>
                                  <span className="text-[10px] uppercase font-bold text-muted-foreground mb-1 block">
                                    {copy.breakfastEnd}
                                  </span>
                                  <select
                                    className={selectClass}
                                    value={sch.breakfastClose}
                                    onChange={(e) => patchDay(key, { breakfastClose: e.target.value })}
                                  >
                                    {timeOptions.map((opt) => (
                                      <option key={opt} value={opt}>
                                        {opt}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            ) : null}
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center justify-between gap-4">
                              <span className="text-[10px] uppercase font-bold text-muted-foreground">{copy.mealLunch}</span>
                              <Switch
                                checked={sch.lunchEnabled}
                                onCheckedChange={(v) => patchDay(key, { lunchEnabled: v })}
                                className="data-[state=checked]:bg-accent shrink-0"
                              />
                            </div>
                            {sch.lunchEnabled ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <span className="text-[10px] uppercase font-bold text-muted-foreground mb-1 block">
                                    {copy.lunchStart}
                                  </span>
                                  <select
                                    className={selectClass}
                                    value={sch.open}
                                    onChange={(e) => patchDay(key, { open: e.target.value })}
                                  >
                                    {timeOptions.map((opt) => (
                                      <option key={opt} value={opt}>
                                        {opt}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <div>
                                  <span className="text-[10px] uppercase font-bold text-muted-foreground mb-1 block">
                                    {copy.lunchEnd}
                                  </span>
                                  <select
                                    className={selectClass}
                                    value={sch.close}
                                    onChange={(e) => patchDay(key, { close: e.target.value })}
                                  >
                                    {timeOptions.map((opt) => (
                                      <option key={opt} value={opt}>
                                        {opt}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            ) : null}
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center justify-between gap-4">
                              <span className="text-[10px] uppercase font-bold text-muted-foreground">{copy.mealDinner}</span>
                              <Switch
                                checked={sch.dinnerEnabled}
                                onCheckedChange={(v) => patchDay(key, { dinnerEnabled: v })}
                                className="data-[state=checked]:bg-accent shrink-0"
                              />
                            </div>
                            {sch.dinnerEnabled ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <span className="text-[10px] uppercase font-bold text-muted-foreground mb-1 block">
                                    {copy.dinnerStart}
                                  </span>
                                  <select
                                    className={selectClass}
                                    value={sch.dinnerOpen}
                                    onChange={(e) => patchDay(key, { dinnerOpen: e.target.value })}
                                  >
                                    {timeOptions.map((opt) => (
                                      <option key={opt} value={opt}>
                                        {opt}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <div>
                                  <span className="text-[10px] uppercase font-bold text-muted-foreground mb-1 block">
                                    {copy.dinnerEnd}
                                  </span>
                                  <select
                                    className={selectClass}
                                    value={sch.dinnerClose}
                                    onChange={(e) => patchDay(key, { dinnerClose: e.target.value })}
                                  >
                                    {timeOptions.map((opt) => (
                                      <option key={opt} value={opt}>
                                        {opt}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card p-5 rounded-xl ring-1 ring-border/30 shadow-sm flex flex-col gap-2">
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
                <UtensilsCrossed className="h-4 w-4 shrink-0 text-accent" />
                {copy.kitchenLastOrder}
              </label>
              <select
                className="bg-transparent border-0 p-0 text-sm font-medium focus:ring-0 cursor-pointer text-accent"
                value={kitchenLastOrder}
                onChange={(e) => setKitchenLastOrder(e.target.value as KitchenKey)}
              >
                {kitchenOptions.map((o) => (
                  <option key={o.key} value={o.key}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="bg-card p-5 rounded-xl ring-1 ring-border/30 shadow-sm flex flex-col gap-2">
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
                <CalendarClock className="h-4 w-4 shrink-0 text-accent" />
                {copy.lastReservation}
              </label>
              <select
                className="bg-transparent border-0 p-0 text-sm font-medium focus:ring-0 cursor-pointer text-accent"
                value={lastReservation}
                onChange={(e) => setLastReservation(e.target.value as ResvKey)}
              >
                {resvOptions.map((o) => (
                  <option key={o.key} value={o.key}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </form>
      </main>

      <OnboardingBottomNav
        backLabel={copy.back}
        continueLabel={copy.continue}
        onBack={() => navigate("/onboarding/business-profile/restaurant")}
        formId="restaurant-hours-form"
      />
    </motion.div>
  );
}
