import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  type DashboardCurrency,
  DASHBOARD_CURRENCY_STORAGE_KEY,
} from "@/lib/dashboard-currency";

type CurrencyContextValue = {
  currency: DashboardCurrency;
  setCurrency: (c: DashboardCurrency) => void;
};

const CurrencyContext = createContext<CurrencyContextValue | undefined>(undefined);

function readStored(): DashboardCurrency {
  try {
    const raw = localStorage.getItem(DASHBOARD_CURRENCY_STORAGE_KEY);
    if (raw === "EUR" || raw === "USD" || raw === "TRY") return raw;
  } catch {
    /* ignore */
  }
  return "TRY";
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<DashboardCurrency>(() =>
    typeof window !== "undefined" ? readStored() : "TRY",
  );

  useEffect(() => {
    setCurrencyState(readStored());
  }, []);

  const setCurrency = useCallback((c: DashboardCurrency) => {
    setCurrencyState(c);
    try {
      localStorage.setItem(DASHBOARD_CURRENCY_STORAGE_KEY, c);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo(() => ({ currency, setCurrency }), [currency, setCurrency]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}
