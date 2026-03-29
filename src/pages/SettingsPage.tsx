import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/LanguageContext";
import { useSupportModal, type SupportModalVariant } from "@/lib/SupportModalContext";
import { useAuth } from "@/lib/AuthContext";
import { DASHBOARD_TOPBAR_PROFILE_IMG } from "@/lib/dashboard-topbar";
import { useNewReservation } from "@/lib/NewReservationContext";
import { useCurrency } from "@/lib/CurrencyContext";
import type { DashboardCurrency } from "@/lib/dashboard-currency";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const PRIVACY_URL = "https://tripeax.com/privacy";
const TERMS_URL = "https://tripeax.com/terms";

const SIDEBAR_NAV_INACTIVE =
  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800";
const SIDEBAR_NAV_ACTIVE =
  "flex items-center gap-3 rounded-lg border-r-4 border-emerald-600 bg-emerald-50 px-3 py-2.5 text-sm font-semibold text-emerald-700 dark:border-emerald-400 dark:bg-emerald-950/30 dark:text-emerald-400";

const SETTINGS_CARD =
  "w-full rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_1px_3px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-900/80";
const ROW_BTN =
  "flex w-full min-w-0 items-center justify-between gap-3 rounded-xl px-4 py-3.5 text-left text-sm font-medium text-dash-ink transition-colors hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-800/80";

const LOGOUT_BTN =
  "flex h-11 w-full items-center justify-center rounded-xl border border-red-200/80 bg-red-500/[0.09] text-sm font-semibold text-red-800 shadow-sm transition-[background-color,box-shadow] hover:bg-red-500/[0.15] hover:shadow-[0_1px_8px_rgba(220,38,38,0.12)] disabled:pointer-events-none disabled:opacity-50 dark:border-red-900/55 dark:bg-red-950/45 dark:text-red-200 dark:hover:bg-red-950/65";

export default function SettingsPage() {
  const { t, lang, setLang } = useLanguage();
  const { currency, setCurrency } = useCurrency();
  const auth = useMemo(() => t.auth, [t.auth]);
  const shell = useMemo(() => t.homeDashboard, [t.homeDashboard]);
  const c = useMemo(() => t.settingsPage, [t.settingsPage]);
  const location = useLocation();
  const navigate = useNavigate();
  const { openSupport } = useSupportModal();
  const { openNewReservation } = useNewReservation();
  const { signOut } = useAuth();
  const navActive = (path: string) => location.pathname === path;

  const [accountDeleteOpen, setAccountDeleteOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const openEmailModal = (variant: SupportModalVariant) => () => openSupport(variant);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await signOut();
      navigate("/auth", { replace: true });
    } finally {
      setLoggingOut(false);
    }
  };

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
              onClick={() => openSupport()}
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

      <main className="ml-64 min-h-screen w-[calc(100%-16rem)] min-w-0 bg-dash-surface pt-16 dark:bg-slate-950">
        <div className="w-full min-w-0 px-4 py-6 sm:px-8 sm:py-8 lg:px-10">
          <h2 className="mb-1 text-3xl font-bold tracking-tight text-dash-ink dark:text-white">{c.pageTitle}</h2>
          <p className="mb-8 text-sm text-slate-500">{c.pageSubtitle}</p>

          <div className="flex w-full min-w-0 flex-col gap-5">
            <section className={SETTINGS_CARD}>
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
                <div className="min-w-0">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                    {c.languageHeading}
                  </h3>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-600 dark:text-slate-400">{c.languageDescription}</p>
                </div>
                <div className="flex shrink-0 flex-col items-stretch gap-2 sm:items-end">
                  <div
                    className="inline-flex rounded-full border border-slate-200/90 bg-slate-100/90 p-1 shadow-[inset_0_1px_2px_rgba(15,23,42,0.06)] dark:border-slate-700 dark:bg-slate-950/60"
                    role="group"
                    aria-label={c.languageHeading}
                  >
                    <button
                      type="button"
                      onClick={() => setLang("en")}
                      className={cn(
                        "min-h-10 min-w-[4.5rem] rounded-full px-4 text-xs font-bold tracking-wide transition-all",
                        lang === "en"
                          ? "bg-white text-emerald-800 shadow-sm ring-1 ring-slate-200/80 dark:bg-slate-800 dark:text-emerald-300 dark:ring-slate-600"
                          : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200",
                      )}
                    >
                      {c.languageEnShort}
                    </button>
                    <button
                      type="button"
                      onClick={() => setLang("tr")}
                      className={cn(
                        "min-h-10 min-w-[4.5rem] rounded-full px-4 text-xs font-bold tracking-wide transition-all",
                        lang === "tr"
                          ? "bg-white text-emerald-800 shadow-sm ring-1 ring-slate-200/80 dark:bg-slate-800 dark:text-emerald-300 dark:ring-slate-600"
                          : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200",
                      )}
                    >
                      {c.languageTrShort}
                    </button>
                  </div>
                  <p className="text-center text-[11px] text-slate-400 sm:text-right dark:text-slate-500">
                    <span className={lang === "en" ? "font-semibold text-emerald-700 dark:text-emerald-400" : ""}>
                      {auth.enLabel}
                    </span>
                    <span className="mx-1.5 text-slate-300 dark:text-slate-600">·</span>
                    <span className={lang === "tr" ? "font-semibold text-emerald-700 dark:text-emerald-400" : ""}>
                      {auth.trLabel}
                    </span>
                  </p>
                </div>
              </div>
            </section>

            <section className={SETTINGS_CARD}>
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
                <div className="min-w-0">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                    {c.currencyHeading}
                  </h3>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-600 dark:text-slate-400">{c.currencyDescription}</p>
                </div>
                <div className="flex shrink-0 flex-col items-stretch gap-2 sm:items-end">
                  <div
                    className="inline-flex rounded-full border border-slate-200/90 bg-slate-100/90 p-1 shadow-[inset_0_1px_2px_rgba(15,23,42,0.06)] dark:border-slate-700 dark:bg-slate-950/60"
                    role="group"
                    aria-label={c.currencyHeading}
                  >
                    {(["USD", "EUR", "TRY"] as const satisfies readonly DashboardCurrency[]).map((code) => (
                      <button
                        key={code}
                        type="button"
                        onClick={() => setCurrency(code)}
                        className={cn(
                          "min-h-10 min-w-[3.25rem] rounded-full px-3 text-xs font-bold tracking-wide transition-all",
                          currency === code
                            ? "bg-white text-emerald-800 shadow-sm ring-1 ring-slate-200/80 dark:bg-slate-800 dark:text-emerald-300 dark:ring-slate-600"
                            : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200",
                        )}
                      >
                        {code === "USD" ? c.currencyUsdShort : code === "EUR" ? c.currencyEurShort : c.currencyTryShort}
                      </button>
                    ))}
                  </div>
                  <p className="text-center text-[11px] text-slate-400 sm:text-right dark:text-slate-500">
                    <span className={currency === "USD" ? "font-semibold text-emerald-700 dark:text-emerald-400" : ""}>
                      {c.currencyUsdLabel}
                    </span>
                    <span className="mx-1 text-slate-300 dark:text-slate-600">·</span>
                    <span className={currency === "EUR" ? "font-semibold text-emerald-700 dark:text-emerald-400" : ""}>
                      {c.currencyEurLabel}
                    </span>
                    <span className="mx-1 text-slate-300 dark:text-slate-600">·</span>
                    <span className={currency === "TRY" ? "font-semibold text-emerald-700 dark:text-emerald-400" : ""}>
                      {c.currencyTryLabel}
                    </span>
                  </p>
                </div>
              </div>
            </section>

            <section className={SETTINGS_CARD}>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">{c.legalHeading}</h3>
              <div className="mt-4 divide-y divide-slate-200 dark:divide-slate-700">
                <a
                  href={PRIVACY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(ROW_BTN, "rounded-t-xl rounded-b-none")}
                >
                  <span>{c.privacyPolicy}</span>
                  <span className="material-symbols-outlined shrink-0 text-lg text-slate-400">open_in_new</span>
                </a>
                <a
                  href={TERMS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(ROW_BTN, "rounded-none rounded-b-xl")}
                >
                  <span>{c.termsOfService}</span>
                  <span className="material-symbols-outlined shrink-0 text-lg text-slate-400">open_in_new</span>
                </a>
              </div>
            </section>

            <section className={SETTINGS_CARD}>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">{c.supportHeading}</h3>
              <div className="mt-4 divide-y divide-slate-200 dark:divide-slate-700">
                <button type="button" className={cn(ROW_BTN, "rounded-t-xl rounded-b-none")} onClick={openEmailModal("helpCenter")}>
                  <span>{c.helpCenter}</span>
                  <span className="material-symbols-outlined shrink-0 text-lg text-slate-400">chevron_right</span>
                </button>
                <button type="button" className={cn(ROW_BTN, "rounded-none rounded-b-xl")} onClick={openEmailModal("reportBug")}>
                  <span>{c.reportBug}</span>
                  <span className="material-symbols-outlined shrink-0 text-lg text-slate-400">chevron_right</span>
                </button>
              </div>
            </section>

            <section className={SETTINGS_CARD}>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">{c.accountHeading}</h3>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">{c.accountDeleteDescription}</p>
              <button
                type="button"
                className="mt-4 w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3.5 text-sm font-semibold text-dash-ink shadow-sm transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-800"
                onClick={() => setAccountDeleteOpen(true)}
              >
                {c.accountDeleteCta}
              </button>
            </section>

            <button
              type="button"
              className={LOGOUT_BTN}
              disabled={loggingOut}
              onClick={() => void handleLogout()}
            >
              {loggingOut ? c.loggingOut : c.logout}
            </button>
          </div>
        </div>
      </main>

      <Dialog open={accountDeleteOpen} onOpenChange={setAccountDeleteOpen}>
        <DialogContent className="max-w-md border-slate-200 sm:rounded-xl dark:border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-dash-ink dark:text-white">{c.accountDeleteModalTitle}</DialogTitle>
            <DialogDescription className="text-left text-base text-slate-600 dark:text-slate-300">
              {c.accountDeleteModalBody}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
