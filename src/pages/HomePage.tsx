import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/LanguageContext";
import { useCurrency } from "@/lib/CurrencyContext";
import {
  DASHBOARD_AMOUNTS_EUR,
  convertFromEur,
  formatDashboardCurrency,
} from "@/lib/dashboard-currency";
import { useSupportModal } from "@/lib/SupportModalContext";
import { useNewReservation } from "@/lib/NewReservationContext";
import { DASHBOARD_TOPBAR_PROFILE_IMG } from "@/lib/dashboard-topbar";

const SIDEBAR_NAV_INACTIVE =
  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800";
const SIDEBAR_NAV_ACTIVE =
  "flex items-center gap-3 rounded-lg border-r-4 border-emerald-600 bg-emerald-50 px-3 py-2.5 text-sm font-semibold text-emerald-700 dark:border-emerald-400 dark:bg-emerald-950/30 dark:text-emerald-400";

const SPARK_COLS = ["bg-emerald-200", "bg-emerald-300", "bg-emerald-400", "bg-emerald-500", "bg-emerald-400", "bg-emerald-600"];

function SparkBars({ heights }: { heights: string[] }) {
  return (
    <div className="mb-1 flex h-8 w-24 items-end gap-0.5 rounded bg-emerald-50/50 px-1 dark:bg-emerald-950/30">
      {heights.map((h, i) => (
        <div
          key={`${i}-${h}`}
          className={cn("w-full rounded-t-sm", SPARK_COLS[i % SPARK_COLS.length])}
          style={{ height: h }}
        />
      ))}
    </div>
  );
}

export default function HomePage() {
  const { t, lang } = useLanguage();
  const { currency } = useCurrency();
  const { openSupport } = useSupportModal();
  const { openNewReservation } = useNewReservation();
  const location = useLocation();
  const d = useMemo(() => t.homeDashboard, [t.homeDashboard]);
  const navActive = (path: string) => location.pathname === path;

  const kpiBookingDisplay = useMemo(
    () =>
      formatDashboardCurrency(
        convertFromEur(DASHBOARD_AMOUNTS_EUR.estBookingValue, currency),
        currency,
        lang,
      ),
    [currency, lang],
  );
  const recoveredTotalDisplay = useMemo(
    () =>
      formatDashboardCurrency(
        convertFromEur(DASHBOARD_AMOUNTS_EUR.recoveredTotal, currency),
        currency,
        lang,
      ),
    [currency, lang],
  );

  const spark1 = ["40%", "60%", "55%", "80%", "70%", "95%"];
  const spark2 = ["70%", "75%", "80%", "85%", "82%", "93%"];
  const spark3 = ["30%", "45%", "40%", "60%", "50%", "70%"];
  const spark4 = ["50%", "65%", "60%", "75%", "70%", "85%"];

  const heatmapHeights = [
    "bg-emerald-50",
    "bg-emerald-100",
    "bg-emerald-200",
    "bg-emerald-400",
    "bg-emerald-600",
    "bg-emerald-500",
    "bg-emerald-700",
    "bg-emerald-400",
    "bg-emerald-300",
    "bg-emerald-200",
    "bg-emerald-100",
    "bg-emerald-50",
  ];

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
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">{d.productTagline}</p>
            </div>
          </div>

          <nav className="flex-1 space-y-1">
            <Link
              to="/home"
              className={cn(navActive("/home") ? SIDEBAR_NAV_ACTIVE : SIDEBAR_NAV_INACTIVE)}
            >
              <span className="material-symbols-outlined">dashboard</span>
              {d.navDashboard}
            </Link>
            <Link to="/calls" className={cn(navActive("/calls") ? SIDEBAR_NAV_ACTIVE : SIDEBAR_NAV_INACTIVE)}>
              <span className="material-symbols-outlined">call</span>
              {d.navCalls}
            </Link>
            <Link
              to="/reservations"
              className={cn(navActive("/reservations") ? SIDEBAR_NAV_ACTIVE : SIDEBAR_NAV_INACTIVE)}
            >
              <span className="material-symbols-outlined">event_available</span>
              {d.navReservations}
            </Link>
          </nav>

          <div className="mt-auto space-y-1 border-t border-slate-200 pt-6 dark:border-slate-800">
            <button
              type="button"
              className="mb-6 w-full rounded-lg bg-dash-primary py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              onClick={() => openNewReservation()}
            >
              {d.newReservation}
            </button>
            <Link
              to="/settings"
              className={cn(navActive("/settings") ? SIDEBAR_NAV_ACTIVE : SIDEBAR_NAV_INACTIVE)}
            >
              <span className="material-symbols-outlined">settings</span>
              {d.navSettings}
            </Link>
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-600 transition-all hover:bg-slate-100 dark:text-slate-400"
              onClick={() => openSupport()}
            >
              <span className="material-symbols-outlined">help</span>
              {d.navSupport}
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
                placeholder={d.searchPlaceholder}
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
                <p className="text-xs font-bold text-dash-ink dark:text-white">{d.userName}</p>
                <p className="text-[10px] text-slate-500">{d.userRole}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="ml-64 min-h-screen bg-dash-surface pt-16 dark:bg-slate-950">
        <div className="mx-auto max-w-[1600px]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-dash-surface-container-low px-4 py-2 text-[11px] font-medium tracking-wide dark:border-slate-800 dark:bg-slate-900/80 sm:px-8">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              <span className="uppercase text-slate-600 dark:text-slate-400">{d.statusAi}</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">{d.statusActive}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="uppercase text-slate-600 dark:text-slate-400">{d.statusWhatsapp}</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">{d.statusConnected}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="uppercase text-slate-600 dark:text-slate-400">{d.statusTheFork}</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">{d.statusConnected}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span className="material-symbols-outlined text-xs">history</span>
            <span>
              {d.statusLastCall} {d.lastCallRelative}
            </span>
          </div>
        </div>

        <div className="space-y-8 p-4 sm:p-8">
          {/* KPI Row */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: "call",
                label: d.kpiCallsHandled,
                value: d.kpiCallsValue,
                spark: spark1,
              },
              {
                icon: "bolt",
                label: d.kpiAutomationRate,
                value: d.kpiAutomationValue,
                spark: spark2,
              },
              {
                icon: "event_available",
                label: d.kpiReservationsAi,
                value: d.kpiReservationsValue,
                spark: spark3,
              },
              {
                icon: "payments",
                label: d.kpiEstBookingValue,
                value: kpiBookingDisplay,
                spark: spark4,
              },
            ].map((k) => (
              <div
                key={k.label}
                className="rounded-xl bg-dash-surface-container-lowest p-5 transition-all duration-200 hover:shadow-lg dark:bg-slate-900/60"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="rounded-lg bg-emerald-50 p-2 dark:bg-emerald-950/50">
                    <span className="material-symbols-outlined text-dash-primary">{k.icon}</span>
                  </div>
                  <span className="material-symbols-outlined cursor-help text-lg text-slate-300">info</span>
                </div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-500">{k.label}</p>
                <div className="flex items-end gap-3">
                  <h3 className="text-3xl font-bold text-dash-ink dark:text-white">{k.value}</h3>
                  <SparkBars heights={k.spark} />
                </div>
              </div>
            ))}
          </div>

          {/* Bento */}
          <div className="grid grid-cols-10 gap-6">
            <div className="group relative col-span-10 overflow-hidden rounded-xl bg-dash-surface-container-lowest p-8 dark:bg-slate-900/60 lg:col-span-6">
              <div className="absolute -right-32 -top-32 h-64 w-64 rounded-full bg-emerald-50 opacity-50 transition-transform group-hover:scale-110 dark:bg-emerald-950/30" />
              <div className="relative z-[1]">
                <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-dash-ink dark:text-white">
                  <span className="material-symbols-outlined text-dash-tertiary">notification_important</span>
                  {d.attentionTitle}
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 rounded-xl border border-transparent bg-dash-surface-container-low p-4 transition-all hover:border-emerald-100 dark:bg-slate-800/80">
                    <span className="h-3 w-3 shrink-0 rounded-full bg-dash-error" />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-dash-ink dark:text-white">{d.attention1Title}</p>
                      <p className="text-xs text-slate-500">{d.attention1Desc}</p>
                    </div>
                    <button
                      type="button"
                      className="shrink-0 rounded-lg bg-dash-primary px-4 py-1.5 text-xs font-bold text-white transition-all hover:opacity-90 active:scale-95"
                    >
                      {d.attention1Cta}
                    </button>
                  </div>
                  <div className="flex items-center gap-4 rounded-xl border border-transparent bg-dash-surface-container-low p-4 transition-all hover:border-emerald-100 dark:bg-slate-800/80">
                    <span className="h-3 w-3 shrink-0 rounded-full bg-amber-400" />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-dash-ink dark:text-white">{d.attention2Title}</p>
                      <p className="text-xs text-slate-500">{d.attention2Desc}</p>
                    </div>
                    <button
                      type="button"
                      className="shrink-0 rounded-lg border border-dash-primary/20 bg-dash-surface-container-lowest px-4 py-1.5 text-xs font-bold text-dash-primary transition-all hover:bg-emerald-50 dark:bg-slate-900 dark:hover:bg-emerald-950/40"
                    >
                      {d.attention2Cta}
                    </button>
                  </div>
                  <div className="flex items-center gap-4 rounded-xl border border-transparent bg-dash-surface-container-low p-4 transition-all hover:border-emerald-100 dark:bg-slate-800/80">
                    <span className="h-3 w-3 shrink-0 rounded-full bg-emerald-500" />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-dash-ink dark:text-white">{d.attention3Title}</p>
                      <p className="text-xs text-slate-500">{d.attention3Desc}</p>
                    </div>
                    <span className="material-symbols-outlined shrink-0 text-emerald-600">check_circle</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-10 rounded-xl border-l-[6px] border-[#FFF1F0] bg-dash-surface-container-lowest p-8 dark:border-rose-900/50 dark:bg-slate-900/60 lg:col-span-4">
              <h2 className="mb-6 text-xl font-bold text-dash-ink dark:text-white">{d.recoveredTitle}</h2>
              <div className="flex flex-col items-center justify-center space-y-8">
                <div className="relative flex items-center justify-center">
                  <svg className="h-48 w-48 -rotate-90 transform" viewBox="0 0 192 192">
                    <circle cx="96" cy="96" r="80" fill="transparent" stroke="#e9edff" strokeWidth="20" />
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      fill="transparent"
                      stroke="#10b981"
                      strokeWidth="20"
                      strokeDasharray="502"
                      strokeDashoffset="150"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      fill="transparent"
                      stroke="#0058be"
                      strokeWidth="20"
                      strokeDasharray="502"
                      strokeDashoffset="380"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      fill="transparent"
                      stroke="#ff7a70"
                      strokeWidth="20"
                      strokeDasharray="502"
                      strokeDashoffset="460"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-xs font-bold uppercase tracking-tighter text-slate-400">{d.recoveredTotalLabel}</p>
                    <p className="text-2xl font-extrabold text-dash-ink dark:text-white">{recoveredTotalDisplay}</p>
                  </div>
                </div>
                <div className="grid w-full grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-dash-primary-container" />
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{d.recoveredLegendAi}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-dash-secondary" />
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{d.recoveredLegendTransferred}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-dash-tertiary-container" />
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{d.recoveredLegendRecovered}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="grid grid-cols-1 gap-6 pb-12 lg:grid-cols-2">
            <div className="rounded-xl bg-dash-surface-container-lowest p-8 dark:bg-slate-900/60">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-dash-ink dark:text-white">{d.peakTimesTitle}</h2>
                <select className="rounded-lg border-none bg-dash-surface-container-low py-1 pl-3 pr-8 text-xs font-bold focus:ring-dash-primary/20 dark:bg-slate-800">
                  <option>{d.period7}</option>
                  <option>{d.period30}</option>
                </select>
              </div>
              <div className="flex h-48 flex-col gap-1.5">
                <div className="grid min-h-0 flex-1 grid-cols-12 gap-1.5">
                  {heatmapHeights.map((c, i) => (
                    <div key={`${i}-${c}`} className={cn("min-h-0 rounded", c)} />
                  ))}
                </div>
                <div className="flex shrink-0 justify-between text-[10px] font-bold uppercase text-slate-400">
                  <span>{d.peakLabel08}</span>
                  <span>{d.peakLabel12}</span>
                  <span>{d.peakLabel16}</span>
                  <span>{d.peakLabel20}</span>
                  <span>{d.peakLabel00}</span>
                </div>
              </div>
            </div>

            <div className="home-dashboard-perspective rounded-xl bg-dash-surface-container-lowest p-8 dark:bg-slate-900/60">
              <h2 className="mb-6 text-xl font-bold text-dash-ink dark:text-white">{d.topQuestionsTitle}</h2>
              <div className="space-y-6">
                {(
                  [
                    { label: d.tq1, pct: d.tq1Pct, w: "42%" },
                    { label: d.tq2, pct: d.tq2Pct, w: "28%" },
                    { label: d.tq3, pct: d.tq3Pct, w: "18%" },
                    { label: d.tq4, pct: d.tq4Pct, w: "12%" },
                  ] as const
                ).map((row) => (
                  <div key={row.label} className="space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-dash-ink dark:text-white">{row.label}</span>
                      <span className="text-slate-500">{row.pct}</span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-dash-surface-container">
                      <div className="h-full rounded-full bg-dash-primary-container" style={{ width: row.w }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        </div>
      </main>

      <button
        type="button"
        onClick={() => openNewReservation()}
        className="fixed bottom-8 right-8 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-dash-primary text-white shadow-2xl transition-all hover:scale-110 active:scale-95"
        aria-label={d.newReservation}
      >
        <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
          add
        </span>
      </button>
    </div>
  );
}
