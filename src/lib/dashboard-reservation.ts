/** Single row in /reservations — matches i18n `reservationsPage.bookings` item shape + stable `id`. */
export type DashboardReservationBooking = {
  id: string;
  guest: string;
  bookedAt: string;
  checkIn: string;
  checkOut: string;
  party: string;
  statusLabel: string;
  variant: "confirmed" | "pending" | "cancelled";
  email: string;
  phone: string;
  room: string;
  nights: string;
  notes: string;
};

export const DASHBOARD_RESERVATIONS_STORAGE_KEY = "tripeax_dashboard_reservations_v1";
