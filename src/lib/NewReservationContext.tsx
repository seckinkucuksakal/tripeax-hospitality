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
  type DashboardReservationBooking,
  DASHBOARD_RESERVATIONS_STORAGE_KEY,
} from "@/lib/dashboard-reservation";

type NewReservationContextValue = {
  extraBookings: DashboardReservationBooking[];
  addBooking: (row: Omit<DashboardReservationBooking, "id">) => void;
  isOpen: boolean;
  openNewReservation: () => void;
  closeNewReservation: () => void;
};

const NewReservationContext = createContext<NewReservationContextValue | undefined>(undefined);

function loadStored(): DashboardReservationBooking[] {
  try {
    const raw = localStorage.getItem(DASHBOARD_RESERVATIONS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (x): x is DashboardReservationBooking =>
        typeof x === "object" &&
        x !== null &&
        typeof (x as DashboardReservationBooking).id === "string" &&
        typeof (x as DashboardReservationBooking).guest === "string",
    );
  } catch {
    return [];
  }
}

export function NewReservationProvider({ children }: { children: ReactNode }) {
  const [extraBookings, setExtraBookings] = useState<DashboardReservationBooking[]>(() =>
    typeof window !== "undefined" ? loadStored() : [],
  );
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setExtraBookings(loadStored());
  }, []);

  const persist = useCallback((rows: DashboardReservationBooking[]) => {
    try {
      localStorage.setItem(DASHBOARD_RESERVATIONS_STORAGE_KEY, JSON.stringify(rows));
    } catch {
      /* ignore quota */
    }
  }, []);

  const addBooking = useCallback(
    (row: Omit<DashboardReservationBooking, "id">) => {
      const full: DashboardReservationBooking = {
        ...row,
        id: crypto.randomUUID(),
      };
      setExtraBookings((prev) => {
        const next = [full, ...prev];
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const value = useMemo(
    () => ({
      extraBookings,
      addBooking,
      isOpen,
      openNewReservation: () => setIsOpen(true),
      closeNewReservation: () => setIsOpen(false),
    }),
    [extraBookings, addBooking, isOpen],
  );

  return <NewReservationContext.Provider value={value}>{children}</NewReservationContext.Provider>;
}

export function useNewReservation() {
  const ctx = useContext(NewReservationContext);
  if (!ctx) throw new Error("useNewReservation must be used within NewReservationProvider");
  return ctx;
}
