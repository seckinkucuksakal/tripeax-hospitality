import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/LanguageContext";
import { useSupportModal } from "@/lib/SupportModalContext";
import { useNewReservation } from "@/lib/NewReservationContext";
import { DASHBOARD_TOPBAR_PROFILE_IMG } from "@/lib/dashboard-topbar";

const SIDEBAR_NAV_INACTIVE =
  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800";
const SIDEBAR_NAV_ACTIVE =
  "flex items-center gap-3 rounded-lg border-r-4 border-emerald-600 bg-emerald-50 px-3 py-2.5 text-sm font-semibold text-emerald-700 dark:border-emerald-400 dark:bg-emerald-950/30 dark:text-emerald-400";

const WAVEFORM_HEIGHTS = [3, 5, 8, 4, 6, 7, 5, 8, 6, 4, 6, 7, 3, 5, 8, 4, 6, 7, 5, 3];

type CallVariant = "inbound" | "outbound" | "missed";

export default function CallsPage() {
  const { t } = useLanguage();
  const location = useLocation();
  const { openSupport } = useSupportModal();
  const { openNewReservation } = useNewReservation();
  const navActive = (path: string) => location.pathname === path;
  const c = useMemo(() => t.callsPage, [t.callsPage]);
  const shell = useMemo(() => t.homeDashboard, [t.homeDashboard]);
  const [selectedIdx, setSelectedIdx] = useState(0);

  const selected = c.calls[selectedIdx];
  if (!selected) return null;

  return (
    <div className="font-dashboard bg-dash-surface text-dash-ink antialiased dark:bg-slate-950 dark:text-slate-100">
      {/* SideNavBar — fixed */}
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
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">{c.productTagline}</p>
            </div>
          </div>

          <nav className="flex-1 space-y-1">
            <Link to="/home" className={cn(navActive("/home") ? SIDEBAR_NAV_ACTIVE : SIDEBAR_NAV_INACTIVE)}>
              <span className="material-symbols-outlined">dashboard</span>
              {c.navDashboard}
            </Link>
            <Link to="/calls" className={cn(navActive("/calls") ? SIDEBAR_NAV_ACTIVE : SIDEBAR_NAV_INACTIVE)}>
              <span className="material-symbols-outlined">call</span>
              {c.navCalls}
            </Link>
            <Link
              to="/reservations"
              className={cn(navActive("/reservations") ? SIDEBAR_NAV_ACTIVE : SIDEBAR_NAV_INACTIVE)}
            >
              <span className="material-symbols-outlined">event_available</span>
              {c.navReservations}
            </Link>
          </nav>

          <div className="mt-auto space-y-1 border-t border-slate-200 pt-6 dark:border-slate-800">
            <button
              type="button"
              className="mb-6 w-full rounded-lg bg-dash-primary py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              onClick={() => openNewReservation()}
            >
              {c.newReservation}
            </button>
            <Link
              to="/settings"
              className={cn(navActive("/settings") ? SIDEBAR_NAV_ACTIVE : SIDEBAR_NAV_INACTIVE)}
            >
              <span className="material-symbols-outlined">settings</span>
              {c.navSettings}
            </Link>
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-600 transition-all hover:bg-slate-100 dark:text-slate-400"
              onClick={() => openSupport()}
            >
              <span className="material-symbols-outlined">help</span>
              {c.navSupport}
            </button>
          </div>
        </div>
      </aside>

      {/* TopNavBar */}
      <header className="fixed right-0 top-0 z-40 flex h-16 w-[calc(100%-16rem)] items-center border-b border-slate-100 bg-white/80 backdrop-blur-md dark:border-slate-800/50 dark:bg-slate-900/80">
        <div className="flex h-full w-full items-center justify-between px-4 sm:px-8">
          <div className="flex max-w-xl flex-1 items-center gap-4">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-lg text-slate-400">
                search
              </span>
              <input
                type="search"
                placeholder={c.searchPlaceholder}
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
              <h2 className="mb-1 text-3xl font-bold tracking-tight text-dash-ink dark:text-white">{c.pageTitle}</h2>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span className="material-symbols-outlined text-base">calendar_today</span>
                <span>{c.dateRange}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-dash-surface-container-lowest px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
              >
                <span className="material-symbols-outlined text-lg">download</span>
                {c.exportCsv}
              </button>
            </div>
          </div>

          <div className="mb-8 flex items-center gap-2 overflow-x-auto pb-2">
            {[c.filterAll, c.filterInbound, c.filterOutboundRecovery, c.filterTransferred].map((label, i) => (
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
              <span className="hidden text-xs font-medium uppercase tracking-widest text-slate-400 sm:inline">{c.sortBy}</span>
              <select className="cursor-pointer border-none bg-transparent text-sm font-semibold text-slate-600 focus:ring-0 dark:text-slate-300">
                <option>{c.sortNewest}</option>
                <option>{c.sortOldest}</option>
                <option>{c.sortDuration}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
            <div className="space-y-4 xl:col-span-2">
              {c.calls.map((call, idx) => (
                <CallRow
                  key={`${call.name}-${idx}`}
                  call={call}
                  durationLabel={c.durationLabel}
                  selected={selectedIdx === idx}
                  onSelect={() => setSelectedIdx(idx)}
                />
              ))}
            </div>

            <div className="relative">
              <div className="sticky top-24 flex h-[calc(100vh-10rem)] w-full flex-col overflow-hidden rounded-2xl bg-dash-surface-container-lowest shadow-xl dark:bg-slate-900">
                <div className="flex items-center justify-between border-b border-slate-100 p-6 dark:border-slate-800">
                  <div>
                    <h3 className="text-lg font-bold text-dash-ink dark:text-white">{c.detailTitle}</h3>
                    <p className="text-sm font-medium text-emerald-600">{selected.name}</p>
                  </div>
                  <button type="button" className="rounded-lg p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>

                <div className="bg-slate-50/50 p-6 dark:bg-slate-900/50">
                  <div className="mb-4 flex items-center gap-4">
                    <button
                      type="button"
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-dash-primary text-white shadow-lg shadow-emerald-500/20 transition-transform hover:scale-105"
                    >
                      <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                        play_arrow
                      </span>
                    </button>
                    <div className="flex h-8 flex-1 items-end gap-px">
                      {WAVEFORM_HEIGHTS.map((h, wi) => (
                        <div
                          key={wi}
                          className={cn(
                            "w-1 rounded-full",
                            wi >= 2 && wi <= 5 ? "bg-dash-primary" : "bg-slate-300 dark:bg-slate-600",
                          )}
                          style={{ height: `${h * 4}px` }}
                        />
                      ))}
                    </div>
                    <button
                      type="button"
                      className="rounded border border-slate-200 bg-white px-2 py-1 text-[10px] font-bold text-slate-600 transition-colors hover:border-dash-primary dark:border-slate-600 dark:bg-slate-800"
                    >
                      {c.playSpeed}
                    </button>
                  </div>
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    <span>{c.timeElapsed}</span>
                    <span>{c.timeTotal}</span>
                  </div>
                </div>

                <div className="min-h-0 flex-1 space-y-6 overflow-y-auto bg-white p-6 dark:bg-slate-950">
                  <div className="flex max-w-[85%] flex-col items-start gap-1">
                    <span className="ml-2 text-[10px] font-bold uppercase text-emerald-600">{c.transcriptAiLabel}</span>
                    <div className="rounded-2xl rounded-tl-none bg-emerald-50 p-4 text-sm leading-relaxed text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100">
                      {c.transcript.ai1}
                    </div>
                  </div>
                  <div className="ml-auto flex max-w-[85%] flex-col items-end gap-1">
                    <span className="mr-2 text-[10px] font-bold uppercase text-slate-400">{selected.name}</span>
                    <div className="rounded-2xl rounded-tr-none border border-slate-100 bg-white p-4 text-sm leading-relaxed text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                      {c.transcript.caller1}
                    </div>
                  </div>
                  <div className="flex max-w-[85%] flex-col items-start gap-1">
                    <span className="ml-2 text-[10px] font-bold uppercase text-emerald-600">{c.transcriptAiLabel}</span>
                    <div className="rounded-2xl rounded-tl-none bg-emerald-50 p-4 text-sm leading-relaxed text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100">
                      {c.transcript.ai2}
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900/80">
                  <h4 className="mb-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">{c.extractedInsights}</h4>
                  <div className="home-dashboard-perspective space-y-3 rounded-xl bg-white p-4 shadow-sm dark:bg-slate-900">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">{c.capturedName}</span>
                      <span className="font-bold text-dash-ink dark:text-white">{c.insightNameValue}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">{c.capturedDate}</span>
                      <span className="font-bold text-dash-ink dark:text-white">{c.insightDateValue}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">{c.leadScore}</span>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-16 overflow-hidden rounded-full bg-slate-100">
                          <div className="h-full w-[90%] bg-emerald-500" />
                        </div>
                        <span className="font-bold text-emerald-600">{c.leadScoreValue}</span>
                      </div>
                    </div>
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
        aria-label={c.newReservation}
      >
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>
    </div>
  );
}

function CallRow({
  call,
  durationLabel,
  selected,
  onSelect,
}: {
  call: {
    name: string;
    time: string;
    phone: string;
    duration: string;
    tag1: string;
    tag2: string;
    variant: string;
  };
  durationLabel: string;
  selected: boolean;
  onSelect: () => void;
}) {
  const v = call.variant as CallVariant;
  const iconWrap = cn(
    "flex h-12 w-12 shrink-0 items-center justify-center rounded-full",
    v === "inbound" && "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50",
    v === "outbound" && "bg-slate-100 text-slate-400 dark:bg-slate-800",
    v === "missed" && "bg-red-50 text-red-600 dark:bg-red-950/40",
  );

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "group flex w-full items-center gap-4 rounded-xl p-5 text-left transition-all sm:gap-6",
        "border border-transparent bg-dash-surface-container-lowest dark:bg-slate-900",
        selected ? "ring-2 ring-emerald-500 shadow-sm" : "hover:bg-slate-50 dark:hover:bg-slate-800/80",
      )}
    >
      <div className={iconWrap}>
        {v === "inbound" ? (
          <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            call_received
          </span>
        ) : v === "missed" ? (
          <span className="material-symbols-outlined text-2xl">call_missed</span>
        ) : (
          <span className="material-symbols-outlined text-2xl">call_made</span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center justify-between gap-2">
          <h4 className="truncate font-bold text-dash-ink dark:text-white">{call.name}</h4>
          <span className="shrink-0 text-xs font-medium text-slate-400">{call.time}</span>
        </div>
        <p className="text-sm text-slate-500">{call.phone}</p>
      </div>
      <div className="hidden w-20 shrink-0 flex-col items-center md:flex">
        <span className="text-xs font-bold uppercase tracking-tighter text-slate-400">{durationLabel}</span>
        <span className="text-sm font-semibold">{call.duration}</span>
      </div>
      <div className="hidden shrink-0 gap-2 md:flex md:gap-3">
        <TagLabel text={call.tag1} variant={v} which={1} />
        <TagLabel text={call.tag2} variant={v} which={2} />
      </div>
    </button>
  );
}

function TagLabel({ text, variant, which }: { text: string; variant: CallVariant; which: 1 | 2 }) {
  if (variant === "inbound") {
    return (
      <span
        className={cn(
          "rounded px-3 py-1 text-[11px] font-bold uppercase tracking-wider",
          which === 1 ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400" : "bg-dash-primary text-white",
        )}
      >
        {text}
      </span>
    );
  }
  if (variant === "outbound") {
    return (
      <span
        className={cn(
          "rounded px-3 py-1 text-[11px] font-bold uppercase tracking-wider",
          which === 1 ? "bg-slate-100 text-slate-600 dark:bg-slate-800" : "bg-slate-200 text-slate-700 dark:bg-slate-700",
        )}
      >
        {text}
      </span>
    );
  }
  return (
    <span
      className={cn(
        "rounded px-3 py-1 text-[11px] font-bold uppercase tracking-wider",
        which === 1 ? "bg-red-50 text-red-700 dark:bg-red-950/50" : "bg-red-600 text-white",
      )}
    >
      {text}
    </span>
  );
}
