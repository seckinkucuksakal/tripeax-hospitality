import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, Lightbulb, Plus, Trash2 } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { OnboardingBottomNav } from "@/components/onboarding/OnboardingBottomNav";
import { OnboardingTopNav } from "@/components/onboarding/OnboardingTopNav";
import { Switch } from "@/components/ui/switch";

const STEP = 4;

type Currency = "TRY" | "EUR" | "USD";

type RoomType = {
  id: string;
  name: string;
  count: string;
  size: string;
  bedType: string;
  view: string;
  maxAdults: string;
  maxChildren: string;
  startingRate: string;
  salesHook: string;
  breakfast: boolean;
  wifi: boolean;
  pool: boolean;
  parking: boolean;
  extraBedAvailable: boolean;
  extraBedRate: string;
  accessibleRoom: boolean;
  interconnecting: boolean;
};

type RoomInventoryPayload = {
  currency: Currency;
  rooms: RoomType[];
};

type ChainState = {
  profile?: unknown;
  hotelHours?: unknown;
  roomInventory?: RoomInventoryPayload;
  bookingFinalization?: unknown;
};

function defaultRoom(name: string, count: string, startingRate: string): RoomType {
  return {
    id: crypto.randomUUID(),
    name,
    count,
    size: "42",
    bedType: "king",
    view: "sea",
    maxAdults: "2",
    maxChildren: "1",
    startingRate,
    salesHook: "",
    breakfast: true,
    wifi: true,
    pool: false,
    parking: false,
    extraBedAvailable: true,
    extraBedRate: "850",
    accessibleRoom: false,
    interconnecting: false,
  };
}

function defaultInventory(): RoomInventoryPayload {
  return {
    currency: "TRY",
    rooms: [defaultRoom("Deluxe Sea View", "18", "4500"), defaultRoom("Standard Garden Room", "24", "2800")],
  };
}

export default function HotelOnboardingStep4Page() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const copy = useMemo(() => t.onboardingHotelRoomInventory, [t.onboardingHotelRoomInventory]);

  const initial = (location.state as ChainState | null)?.roomInventory ?? defaultInventory();
  const [currency, setCurrency] = useState<Currency>(initial.currency);
  const [rooms, setRooms] = useState<RoomType[]>(initial.rooms);
  const [expandedRoomId, setExpandedRoomId] = useState<string>(initial.rooms[0]?.id ?? "");

  function patchRoom(id: string, patch: Partial<RoomType>) {
    setRooms((prev) => prev.map((room) => (room.id === id ? { ...room, ...patch } : room)));
  }

  function addRoomType() {
    const created = defaultRoom(copy.newRoomDefaultName, "1", "0");
    setRooms((prev) => [...prev, created]);
    setExpandedRoomId(created.id);
  }

  function removeRoomType(id: string) {
    setRooms((prev) => prev.filter((room) => room.id !== id));
    if (expandedRoomId === id) setExpandedRoomId("");
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const prev = (location.state ?? null) as ChainState | null;
    navigate("/onboarding/hotel/step-5", {
      state: {
        profile: prev?.profile,
        hotelHours: prev?.hotelHours,
        bookingFinalization: prev?.bookingFinalization,
        roomInventory: {
          currency,
          rooms,
        } satisfies RoomInventoryPayload,
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

      <main className="pt-6 pb-32 px-6 max-w-5xl mx-auto">
        <section className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight mb-3">{copy.headline}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">{copy.subhead}</p>
        </section>

        <form id="hotel-room-inventory-form" className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <button
              type="button"
              onClick={addRoomType}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg border-2 border-accent text-accent font-semibold hover:bg-accent/5 transition-all"
            >
              <Plus className="h-4 w-4" />
              {copy.addRoomType}
            </button>
            <div className="flex items-center bg-muted p-1 rounded-xl">
              {(["TRY", "EUR", "USD"] as const).map((cur) => (
                <button
                  key={cur}
                  type="button"
                  onClick={() => setCurrency(cur)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    currency === cur ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-card"
                  }`}
                >
                  {copy.currency[cur]}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {rooms.map((room) => {
              const expanded = expandedRoomId === room.id;
              return (
                <div key={room.id} className="bg-card rounded-xl border border-border/30 overflow-hidden shadow-sm">
                  <div className="flex items-center justify-between gap-3 p-5 bg-muted/30">
                    <button type="button" className="text-left flex-1 min-w-0" onClick={() => setExpandedRoomId(expanded ? "" : room.id)}>
                      <h3 className="font-bold">{room.name || copy.newRoomDefaultName}</h3>
                      <div className="flex gap-3 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {copy.unitsLabel.replace("{count}", room.count || "0")}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {copy.fromRateLabel
                            .replace("{rate}", room.startingRate || "0")
                            .replace("{currency}", copy.currencyShort[currency])}
                        </span>
                      </div>
                    </button>
                    <div className="flex items-center gap-1 shrink-0">
                      <button type="button" onClick={() => removeRoomType(room.id)} className="p-2 text-destructive hover:bg-destructive/10 rounded-lg">
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setExpandedRoomId(expanded ? "" : room.id)}
                        className="p-2 text-accent hover:bg-accent/10 rounded-lg"
                        aria-expanded={expanded}
                      >
                        {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {expanded ? (
                    <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <div className="space-y-4">
                        <h4 className="text-sm font-bold text-foreground">{copy.basicsTitle}</h4>
                        <div>
                          <label htmlFor={`${room.id}-name`} className="block text-xs font-semibold text-muted-foreground mb-1.5">
                            {copy.roomNameLabel}
                          </label>
                          <input
                            id={`${room.id}-name`}
                            value={room.name}
                            onChange={(e) => patchRoom(room.id, { name: e.target.value })}
                            className="w-full bg-background border border-border/40 rounded-lg px-3 py-2.5 text-sm"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label htmlFor={`${room.id}-count`} className="block text-xs font-semibold text-muted-foreground mb-1.5">
                              {copy.countLabel}
                            </label>
                            <input
                              id={`${room.id}-count`}
                              value={room.count}
                              onChange={(e) => patchRoom(room.id, { count: e.target.value })}
                              type="number"
                              min={0}
                              className="w-full bg-background border border-border/40 rounded-lg px-3 py-2.5 text-sm"
                            />
                          </div>
                          <div>
                            <label htmlFor={`${room.id}-size`} className="block text-xs font-semibold text-muted-foreground mb-1.5">
                              {copy.sizeLabel}
                            </label>
                            <input
                              id={`${room.id}-size`}
                              value={room.size}
                              onChange={(e) => patchRoom(room.id, { size: e.target.value })}
                              type="number"
                              min={0}
                              className="w-full bg-background border border-border/40 rounded-lg px-3 py-2.5 text-sm"
                            />
                          </div>
                        </div>
                        <div>
                          <label htmlFor={`${room.id}-bed`} className="block text-xs font-semibold text-muted-foreground mb-1.5">
                            {copy.bedTypeLabel}
                          </label>
                          <select
                            id={`${room.id}-bed`}
                            value={room.bedType}
                            onChange={(e) => patchRoom(room.id, { bedType: e.target.value })}
                            className="w-full bg-background border border-border/40 rounded-lg px-3 py-2.5 text-sm"
                          >
                            <option value="king">{copy.bedKing}</option>
                            <option value="queen">{copy.bedQueen}</option>
                            <option value="twin">{copy.bedTwin}</option>
                            <option value="double">{copy.bedDouble}</option>
                            <option value="king_twin">{copy.bedKingTwin}</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor={`${room.id}-view`} className="block text-xs font-semibold text-muted-foreground mb-1.5">
                            {copy.viewLabel}
                          </label>
                          <select
                            id={`${room.id}-view`}
                            value={room.view}
                            onChange={(e) => patchRoom(room.id, { view: e.target.value })}
                            className="w-full bg-background border border-border/40 rounded-lg px-3 py-2.5 text-sm"
                          >
                            <option value="sea">{copy.viewSea}</option>
                            <option value="city">{copy.viewCity}</option>
                            <option value="garden">{copy.viewGarden}</option>
                            <option value="pool">{copy.viewPool}</option>
                            <option value="mountain">{copy.viewMountain}</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-sm font-bold text-foreground">{copy.capacityPricingTitle}</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label htmlFor={`${room.id}-adults`} className="block text-xs font-semibold text-muted-foreground mb-1.5">
                              {copy.maxAdultsLabel}
                            </label>
                            <input
                              id={`${room.id}-adults`}
                              value={room.maxAdults}
                              onChange={(e) => patchRoom(room.id, { maxAdults: e.target.value })}
                              type="number"
                              min={1}
                              className="w-full bg-background border border-border/40 rounded-lg px-3 py-2.5 text-sm"
                            />
                          </div>
                          <div>
                            <label htmlFor={`${room.id}-children`} className="block text-xs font-semibold text-muted-foreground mb-1.5">
                              {copy.maxChildrenLabel}
                            </label>
                            <input
                              id={`${room.id}-children`}
                              value={room.maxChildren}
                              onChange={(e) => patchRoom(room.id, { maxChildren: e.target.value })}
                              type="number"
                              min={0}
                              className="w-full bg-background border border-border/40 rounded-lg px-3 py-2.5 text-sm"
                            />
                          </div>
                        </div>
                        <div>
                          <label htmlFor={`${room.id}-rate`} className="block text-xs font-semibold text-muted-foreground mb-1.5">
                            {copy.startingRateLabel} ({copy.currencyShort[currency]})
                          </label>
                          <div className="relative">
                            <input
                              id={`${room.id}-rate`}
                              value={room.startingRate}
                              onChange={(e) => patchRoom(room.id, { startingRate: e.target.value })}
                              type="number"
                              min={0}
                              className="w-full bg-background border border-border/40 rounded-lg pl-3 pr-12 py-2.5 text-sm"
                            />
                            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                              {copy.currencyShort[currency]}
                            </span>
                          </div>
                        </div>
                        <div>
                          <label htmlFor={`${room.id}-hook`} className="block text-xs font-semibold text-muted-foreground mb-1.5">
                            {copy.salesHookLabel}
                          </label>
                          <textarea
                            id={`${room.id}-hook`}
                            value={room.salesHook}
                            onChange={(e) => patchRoom(room.id, { salesHook: e.target.value })}
                            placeholder={copy.salesHookPlaceholder}
                            rows={4}
                            className="w-full bg-background border border-border/40 rounded-lg px-3 py-2.5 text-sm resize-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-sm font-bold text-foreground">{copy.detailsTitle}</h4>
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground mb-2">{copy.inclusionsTitle}</p>
                          <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" checked={room.breakfast} onChange={(e) => patchRoom(room.id, { breakfast: e.target.checked })} />
                              {copy.inclusionBreakfast}
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" checked={room.wifi} onChange={(e) => patchRoom(room.id, { wifi: e.target.checked })} />
                              {copy.inclusionWifi}
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" checked={room.pool} onChange={(e) => patchRoom(room.id, { pool: e.target.checked })} />
                              {copy.inclusionPool}
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" checked={room.parking} onChange={(e) => patchRoom(room.id, { parking: e.target.checked })} />
                              {copy.inclusionParking}
                            </label>
                          </div>
                        </div>
                        <div className="space-y-3 pt-1">
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-xs font-semibold text-muted-foreground">{copy.extraBedLabel}</span>
                            <Switch checked={room.extraBedAvailable} onCheckedChange={(v) => patchRoom(room.id, { extraBedAvailable: v })} className="data-[state=checked]:bg-accent shrink-0" />
                          </div>
                          {room.extraBedAvailable ? (
                            <div>
                              <label htmlFor={`${room.id}-extra-rate`} className="sr-only">
                                {copy.extraBedRatePlaceholder}
                              </label>
                              <div className="relative">
                                <input
                                  id={`${room.id}-extra-rate`}
                                  value={room.extraBedRate}
                                  onChange={(e) => patchRoom(room.id, { extraBedRate: e.target.value })}
                                  placeholder={copy.extraBedRatePlaceholder}
                                  type="number"
                                  min={0}
                                  className="w-full bg-background border border-border/40 rounded-lg pl-3 pr-[7.5rem] py-2.5 text-sm"
                                />
                                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground whitespace-nowrap">
                                  {copy.extraBedPerNight.replace("{currency}", copy.currencyShort[currency])}
                                </span>
                              </div>
                            </div>
                          ) : null}
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-xs font-semibold text-muted-foreground">{copy.accessibleLabel}</span>
                            <Switch checked={room.accessibleRoom} onCheckedChange={(v) => patchRoom(room.id, { accessibleRoom: v })} className="data-[state=checked]:bg-accent shrink-0" />
                          </div>
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-xs font-semibold text-muted-foreground">{copy.interconnectingLabel}</span>
                            <Switch checked={room.interconnecting} onCheckedChange={(v) => patchRoom(room.id, { interconnecting: v })} className="data-[state=checked]:bg-accent shrink-0" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>

          <div className="mt-8 bg-card p-6 rounded-xl relative overflow-hidden border border-border/20 shadow-sm">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent" />
            <div className="flex items-start gap-3">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Lightbulb className="h-4 w-4 text-accent" />
              </div>
              <div>
                <h4 className="font-bold mb-1">{copy.insightTitle}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{copy.insightDesc}</p>
              </div>
            </div>
          </div>
        </form>
      </main>

      <OnboardingBottomNav
        backLabel={copy.back}
        continueLabel={copy.continue}
        onBack={() => navigate("/onboarding/hotel/step-3", { state: location.state })}
        formId="hotel-room-inventory-form"
      />
    </motion.div>
  );
}
