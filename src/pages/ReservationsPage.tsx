import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/LanguageContext";
import { useSupportModal } from "@/lib/SupportModalContext";
import { useNewReservation } from "@/lib/NewReservationContext";
import type { DashboardReservationBooking } from "@/lib/dashboard-reservation";
import { DASHBOARD_TOPBAR_PROFILE_IMG } from "@/lib/dashboard-topbar";

const SIDEBAR_NAV_INACTIVE =
  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800";
const SIDEBAR_NAV_ACTIVE =
  "flex items-center gap-3 rounded-lg border-r-4 border-emerald-600 bg-emerald-50 px-3 py-2.5 text-sm font-semibold text-emerald-700 dark:border-emerald-400 dark:bg-emerald-950/30 dark:text-emerald-400";

type BookingVariant = "confirmed" | "pending" | "cancelled";

export default function ReservationsPage() {
  const { t } = useLanguage();
  const location = useLocation();
  const { openSupport } = useSupportModal();
  const { extraBookings, openNewReservation } = useNewReservation();
  const navActive = (path: string) => location.pathname === path;
  const r = useMemo(() => t.reservationsPage, [t.reservationsPage]);
  const shell = useMemo(() => t.homeDashboard, [t.homeDashboard]);
  const [selectedIdx, setSelectedIdx] = useState(0);

  const allBookings = useMemo((): DashboardReservationBooking[] => {
    const seed: DashboardReservationBooking[] = r.bookings.map((b, i) => ({
      ...b,
      id: `seed-${i}`,
      variant: b.variant as DashboardReservationBooking["variant"],
    }));
    return [...extraBookings, ...seed];
  }, [extraBookings, r.bookings]);

  const prevExtraLen = useRef(extraBookings.length);
  useEffect(() => {
    if (extraBookings.length > prevExtraLen.current) {
      setSelectedIdx(0);
    }
    prevExtraLen.current = extraBookings.length;
  }, [extraBookings.length]);

  useEffect(() => {
    if (allBookings.length === 0) return;
    if (selectedIdx >= allBookings.length) {
      setSelectedIdx(Math.max(0, allBookings.length - 1));
    }
  }, [allBookings.length, selectedIdx]);

  const selected = allBookings[selectedIdx];
  if (!selected) return null;

  return (
    <div className="font-dashboard bg-dash-surface text-dash-ink antialiased dark:bg-slate-950 dark:text-slate-100">
      <aside className="fixed left-0 top-0 z-50 flex h-screen w-64 flex-col bg-slate-50 antialiased dark:bg-slate-900">
        <div className="flex h-full flex-col px-4 py-6">
          <div className="mb-8 flex items-center gap-3 px-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-dash-primary-container text-white">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                dataset
              </span>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-emerald-700 dark:text-emerald-400">Tripeax</h1>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">{r.productTagline}</p>
            </div>
          </div>

          <nav className="flex-1 space-y-1">
            <Link to="/home" className={cn(navActive("/home") ? SIDEBAR_NAV_ACTIVE : SIDEBAR_NAV_INACTIVE)}>
              <span className="material-symbols-outlined">dashboard</span>
              {r.navDashboard}
            </Link>
            <Link to="/calls" className={cn(navActive("/calls") ? SIDEBAR_NAV_ACTIVE : SIDEBAR_NAV_INACTIVE)}>
              <span className="material-symbols-outlined">call</span>
              {r.navCalls}
            </Link>
            <Link
              to="/reservations"
              className={cn(navActive("/reservations") ? SIDEBAR_NAV_ACTIVE : SIDEBAR_NAV_INACTIVE)}
            >
              <span className="material-symbols-outlined">event_available</span>
              {r.navReservations}
            </Link>
          </nav>

          <div className="mt-auto space-y-1 border-t border-slate-200 pt-6 dark:border-slate-800">
            <button
              type="button"
              className="mb-6 w-full rounded-lg bg-dash-primary py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              onClick={() => openNewReservation()}
            >
              {r.newReservation}
            </button>
            <Link
              to="/settings"
              className={cn(navActive("/settings") ? SIDEBAR_NAV_ACTIVE : SIDEBAR_NAV_INACTIVE)}
            >
              <span className="material-symbols-outlined">settings</span>
              {r.navSettings}
            </Link>
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-600 transition-all hover:bg-slate-100 dark:text-slate-400"
              onClick={() => openSupport()}
            >
              <span className="material-symbols-outlined">help</span>
              {r.navSupport}
            </button>
          </div>
        </div>
      </aside>

      <header className="fixed right-0 top-0 z-40 flex h-16 w-[calc(100%-16rem)] items-center border-b border-slate-100 bg-white/80 backdrop-blur-md dark:border-slate-800/50 dark:bg-slate-900/80">
        <div className="flex h-full w-full items-center justify-between px-4 sm:px-8">
          <div className="flex max-w-xl flex-1 items-center gap-4">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-lg text-slate-400">
                search
              </span>
              <input
                type="search"
                placeholder={r.searchPlaceholder}
                className="w-full rounded-lg border-none bg-dash-surface-container-low py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 dark:bg-slate-800"
              />
            </div>
          </div>
          <div className="ml-4 flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              className="relative rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-dash-error" />
            </button>
            <button
              type="button"
              className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <span className="material-symbols-outlined">help_outline</span>
            </button>
            <div className="mx-1 hidden h-8 w-px bg-slate-200 sm:block dark:bg-slate-700" />
            <div className="group flex cursor-pointer items-center gap-3">
              <img
                alt=""
                className="h-8 w-8 rounded-full object-cover ring-2 ring-transparent transition-all group-hover:ring-emerald-500/30"
                src={DASHBOARD_TOPBAR_PROFILE_IMG}
              />
              <div className="hidden text-right lg:block">
                <p className="text-xs font-bold text-dash-ink dark:text-white">{shell.userName}</p>
                <p className="text-[10px] text-slate-500">{shell.userRole}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="ml-64 min-h-screen bg-dash-surface pt-16 dark:bg-slate-950">
        <div className="mx-auto max-w-[1600px] p-4 sm:p-8">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h2 className="mb-1 text-3xl font-bold tracking-tight text-dash-ink dark:text-white">{r.pageTitle}</h2>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span className="material-symbols-outlined text-base">calendar_today</span>
                <span>{r.dateRange}</span>
              </div>
            </div>
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-dash-surface-container-lowest px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
            >
              <span className="material-symbols-outlined text-lg">download</span>
              {r.exportCsv}
            </button>
          </div>

          <div className="mb-8 flex flex-wrap items-center gap-2 overflow-x-auto pb-2">
            {[r.filterAll, r.filterConfirmed, r.filterPending, r.filterCancelled].map((label, i) => (
              <button
                key={label}
                type="button"
                className={cn(
                  "shrink-0 rounded-full px-5 py-2 text-sm font-semibold shadow-sm transition-all",
                  i === 0 ? "bg-dash-primary text-white" : "bg-dash-surface-container-low text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700",
                )}
              >
                {label}
              </button>
            ))}
            <div className="ml-auto flex min-w-0 items-center gap-3">
              <span className="hidden text-xs font-medium uppercase tracking-widest text-slate-400 sm:inline">{r.sortBy}</span>
              <select className="cursor-pointer border-none bg-transparent text-sm font-semibold text-slate-600 focus:ring-0 dark:text-slate-300">
                <option>{r.sortNewest}</option>
                <option>{r.sortCheckIn}</option>
                <option>{r.sortGuest}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
            <div className="space-y-4 xl:col-span-2">
              {allBookings.map((booking, idx) => (
                <ReservationRow
                  key={booking.id}
                  booking={booking}
                  labels={{ booked: r.colBooked, checkIn: r.colCheckIn, guests: r.colGuests }}
                  selected={selectedIdx === idx}
                  onSelect={() => setSelectedIdx(idx)}
                />
              ))}
            </div>

            <div className="relative">
              <div className="sticky top-24 flex max-h-[calc(100vh-10rem)] w-full flex-col overflow-hidden rounded-2xl bg-dash-surface-container-lowest shadow-xl dark:bg-slate-900">
                <div className="flex items-center justify-between border-b border-slate-100 p-6 dark:border-slate-800">
                  <div>
                    <h3 className="text-lg font-bold text-dash-ink dark:text-white">{r.detailTitle}</h3>
                    <p className="text-sm font-medium text-emerald-600">{selected.guest}</p>
                  </div>
                  <button type="button" className="rounded-lg p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>

                <div className="flex-1 space-y-4 overflow-y-auto p-6">
                  <DetailRow label={r.labelEmail} value={selected.email} />
                  <DetailRow label={r.labelPhone} value={selected.phone} />
                  <DetailRow label={r.labelCheckIn} value={selected.checkIn} />
                  <DetailRow label={r.labelCheckOut} value={selected.checkOut} />
                  <DetailRow label={r.labelRoom} value={selected.room} />
                  <DetailRow label={r.labelNights} value={selected.nights} />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">{r.labelSource}</span>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                      {r.sourceVoiceAi}
                    </span>
                  </div>
                  <div className="home-dashboard-perspective rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800/80">
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">{r.labelNotes}</p>
                    <p className="text-sm leading-relaxed text-dash-ink dark:text-slate-200">{selected.notes}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <button
        type="button"
        onClick={() => openNewReservation()}
        className="fixed bottom-8 right-8 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-dash-primary text-white shadow-2xl transition-transform hover:scale-110 active:scale-95"
        aria-label={r.newReservation}
      >
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <span className="shrink-0 text-slate-500">{label}</span>
      <span className="text-right font-semibold text-dash-ink dark:text-white">{value}</span>
    </div>
  );
}

function ReservationRow({
  booking,
  labels,
  selected,
  onSelect,
}: {
  booking: {
    guest: string;
    bookedAt: string;
    checkIn: string;
    checkOut: string;
    party: string;
    statusLabel: string;
    variant: string;
  };
  labels: { booked: string; checkIn: string; guests: string };
  selected: boolean;
  onSelect: () => void;
}) {
  const v = booking.variant as BookingVariant;
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "group grid w-full gap-4 rounded-xl border border-transparent bg-dash-surface-container-lowest p-5 text-left transition-all dark:bg-slate-900",
        "grid-cols-[3rem_minmax(0,1fr)_8.25rem]",
        "md:grid-cols-[3rem_minmax(0,1fr)_8.25rem_repeat(3,minmax(0,1fr))] md:items-center md:gap-x-4 lg:gap-x-6",
        selected ? "ring-2 ring-emerald-500 shadow-sm" : "hover:bg-slate-50 dark:hover:bg-slate-800/80",
      )}
    >
      <div
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-full",
          v === "confirmed" && "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50",
          v === "pending" && "bg-amber-50 text-amber-700 dark:bg-amber-950/40",
          v === "cancelled" && "bg-slate-100 text-slate-500 dark:bg-slate-800",
        )}
      >
        <span className="material-symbols-outlined text-2xl">event_available</span>
      </div>
      <div className="min-w-0">
        <h4 className="truncate font-bold leading-snug text-dash-ink dark:text-white">{booking.guest}</h4>
        <p className="mt-0.5 text-sm text-slate-500">{booking.bookedAt}</p>
      </div>
      <div className="flex min-h-[3rem] w-full min-w-0 items-center justify-start justify-self-stretch">
        <StatusPill variant={v} label={booking.statusLabel} />
      </div>
      <div className="col-span-3 grid min-w-0 grid-cols-3 gap-3 text-sm md:contents">
        <div className="min-w-0">
          <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-400">{labels.booked}</span>
          <p className="line-clamp-2 font-semibold leading-tight text-dash-ink dark:text-white">{booking.bookedAt}</p>
        </div>
        <div className="min-w-0">
          <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-400">{labels.checkIn}</span>
          <p className="font-semibold text-dash-ink dark:text-white">{booking.checkIn}</p>
        </div>
        <div className="min-w-0">
          <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-400">{labels.guests}</span>
          <p className="font-semibold text-dash-ink dark:text-white">{booking.party}</p>
        </div>
      </div>
    </button>
  );
}

function StatusPill({ variant, label }: { variant: BookingVariant; label: string }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 whitespace-nowrap rounded px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider",
        variant === "confirmed" && "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300",
        variant === "pending" && "bg-amber-100 text-amber-900 dark:bg-amber-950/50 dark:text-amber-200",
        variant === "cancelled" && "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200",
      )}
    >
      {label}
    </span>
  );
}
