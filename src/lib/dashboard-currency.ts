import type { Lang } from "@/lib/i18n";

export type DashboardCurrency = "EUR" | "USD" | "TRY";

export const DASHBOARD_CURRENCY_STORAGE_KEY = "tripeax_dashboard_currency_v1";

/** Demo amounts stored in EUR; converted with fixed rates for the dashboard KPIs. */
export const DASHBOARD_AMOUNTS_EUR = {
  estBookingValue: 1180,
  recoveredTotal: 343,
} as const;

const RATES_FROM_EUR: Record<DashboardCurrency, number> = {
  EUR: 1,
  USD: 1.086,
  TRY: 36.15,
};

export function convertFromEur(amountEur: number, currency: DashboardCurrency): number {
  return amountEur * RATES_FROM_EUR[currency];
}

export function formatDashboardCurrency(amount: number, currency: DashboardCurrency, lang: Lang): string {
  const locale = lang === "tr" ? "tr-TR" : "en-US";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
