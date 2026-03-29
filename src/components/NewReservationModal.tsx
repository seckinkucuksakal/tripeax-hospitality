import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/lib/LanguageContext";
import type { Lang } from "@/lib/i18n";
import { useNewReservation } from "@/lib/NewReservationContext";

function todayISODate() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function buildBookingRow(
  lang: Lang,
  m: {
    defaultRoom: string;
    partyLine: string;
    statusLabel: string;
    notesAuto: string;
  },
  guest: string,
  phone: string,
  dateStr: string,
  timeStr: string,
  paxNum: number,
) {
  const locale = lang === "tr" ? "tr-TR" : "en-US";
  const safeTime = timeStr || "12:00";
  let dateObj = new Date(`${dateStr}T${safeTime}`);
  if (Number.isNaN(dateObj.getTime())) {
    dateObj = new Date();
  }
  const bookedAt = dateObj.toLocaleString(locale, { dateStyle: "medium", timeStyle: "short" });
  const checkIn = dateObj.toLocaleDateString(locale, { dateStyle: "medium" });
  const checkOutD = new Date(dateObj);
  checkOutD.setDate(checkOutD.getDate() + 1);
  const checkOut = checkOutD.toLocaleDateString(locale, { dateStyle: "medium" });
  const party = m.partyLine.replace("{n}", String(paxNum));
  const notes = m.notesAuto.replace("{time}", safeTime);
  return {
    guest: guest.trim(),
    bookedAt,
    checkIn,
    checkOut,
    party,
    statusLabel: m.statusLabel,
    variant: "confirmed" as const,
    email: "—",
    phone: phone.trim() || "—",
    room: m.defaultRoom,
    nights: "1",
    notes,
  };
}

export function NewReservationModal() {
  const { t, lang } = useLanguage();
  const m = t.newReservationModal;
  const { isOpen, closeNewReservation, addBooking } = useNewReservation();
  const navigate = useNavigate();
  const location = useLocation();

  const [guest, setGuest] = useState("");
  const [phone, setPhone] = useState("");
  const [dateStr, setDateStr] = useState(todayISODate());
  const [timeStr, setTimeStr] = useState("19:30");
  const [paxStr, setPaxStr] = useState("2");

  useEffect(() => {
    if (!isOpen) return;
    setDateStr(todayISODate());
    setTimeStr("19:30");
    setPaxStr("2");
    setGuest("");
    setPhone("");
  }, [isOpen]);

  const paxNum = useMemo(() => {
    const n = parseInt(paxStr, 10);
    return Number.isFinite(n) && n > 0 ? Math.min(n, 99) : 1;
  }, [paxStr]);

  const submit = () => {
    const g = guest.trim();
    if (!g) {
      toast.error(lang === "tr" ? "Misafir adı gerekli." : "Guest name is required.");
      return;
    }
    const row = buildBookingRow(lang, m, g, phone, dateStr, timeStr, paxNum);
    addBooking(row);
    toast.success(m.successToast);
    closeNewReservation();
    if (location.pathname !== "/reservations") {
      navigate("/reservations");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeNewReservation()}>
      <DialogContent className="z-[100] max-h-[min(90vh,720px)] max-w-lg overflow-y-auto border-slate-200 p-0 sm:rounded-2xl dark:border-slate-700">
        <div className="border-b border-slate-100 bg-slate-50/80 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/80">
          <DialogHeader className="space-y-1 text-left">
            <DialogTitle className="text-xl font-bold text-dash-ink dark:text-white">{m.title}</DialogTitle>
            <DialogDescription className="sr-only">{m.title}</DialogDescription>
          </DialogHeader>
        </div>

        <div className="flex flex-col gap-6 px-6 py-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nr-guest" className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                {m.guestName}
              </Label>
              <Input
                id="nr-guest"
                value={guest}
                onChange={(e) => setGuest(e.target.value)}
                className="rounded-xl border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950"
                autoComplete="name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nr-phone" className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                {m.phone}
              </Label>
              <Input
                id="nr-phone"
                type="tel"
                placeholder={m.phonePlaceholder}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="rounded-xl border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950"
                autoComplete="tel"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="nr-date" className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                {m.date}
              </Label>
              <Input
                id="nr-date"
                type="date"
                value={dateStr}
                onChange={(e) => setDateStr(e.target.value)}
                className="rounded-xl border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nr-time" className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                {m.time}
              </Label>
              <Input
                id="nr-time"
                type="time"
                value={timeStr}
                onChange={(e) => setTimeStr(e.target.value)}
                className="rounded-xl border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nr-pax" className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                {m.pax}
              </Label>
              <Input
                id="nr-pax"
                type="number"
                min={1}
                max={99}
                value={paxStr}
                onChange={(e) => setPaxStr(e.target.value)}
                className="rounded-xl border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950"
              />
            </div>
          </div>

          <div className="flex gap-3 rounded-xl border border-emerald-200/80 bg-emerald-50/60 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/30">
            <span className="material-symbols-outlined shrink-0 text-emerald-600 dark:text-emerald-400">auto_awesome</span>
            <div>
              <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300">{m.smartTitle}</p>
              <p className="mt-1 text-[11px] leading-relaxed text-emerald-800/85 dark:text-emerald-200/90">{m.smartBody}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" className="rounded-xl font-semibold" onClick={() => closeNewReservation()}>
              {m.cancel}
            </Button>
            <Button
              type="button"
              className="rounded-xl bg-dash-primary font-semibold text-white hover:bg-emerald-700 sm:min-w-[180px]"
              onClick={() => submit()}
            >
              {m.confirm}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
