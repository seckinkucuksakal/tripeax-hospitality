import { useMemo } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

type Payload = {
  businessType?: "restaurant" | "hotel" | null;
  interests?: string[];
  step3?: Record<string, unknown>;
  details?: { firstName?: string; lastName?: string; email?: string };
  step5?: { phone?: string; businessName?: string; notes?: string; agreed?: boolean };
};

const PAGE_COPY = {
  en: {
    title: "AI Front Desk Agent — Discovery Call",
    subtitle: "Pick a time in Google Calendar for your discovery call.",
    duration: "Duration",
    durationValue: "⏱ 15 Minutes",
    selectDate: "Select a date",
    below: "📅 Below",
    timezone: "Timezone",
    bookedTitle: "You're booked!",
    bookedSubtitle: "Please check your Google Calendar booking details.",
    bookedBody:
      "Thanks for booking. We look forward to speaking with you.",
    backToSite: "Back to site",
    notConfigured: "Calendar embed not configured",
    setEnv: "Set `VITE_GOOGLE_CALENDAR_EMBED_URL` in your environment to your Google Calendar booking embed URL.",
    continueWhenReady:
      "After configuring the embed URL, bookings will appear here.",
    afterPickSlot: "After you pick a slot in the widget, come back here to see confirmation.",
    bookedCta: "I've booked my call ->",
    iframeTitle: "Discovery call calendar",
    turkey: "Turkey",
  },
  tr: {
    title: "AI Front Desk Agent — Kesif Gorusmesi",
    subtitle: "Kesif gorusmeniz icin Google Calendar uzerinden uygun bir saat secin.",
    duration: "Sure",
    durationValue: "⏱ 15 Dakika",
    selectDate: "Tarih secin",
    below: "📅 Asagida",
    timezone: "Saat Dilimi",
    bookedTitle: "Randevunuz olusturuldu!",
    bookedSubtitle: "Lutfen Google Calendar rezervasyon detaylarinizi kontrol edin.",
    bookedBody:
      "Rezervasyonunuz icin tesekkurler. Gorusmede sizi bekliyoruz.",
    backToSite: "Siteye don",
    notConfigured: "Takvim yerlesimi ayarlanmamis",
    setEnv:
      "Ortam degiskenlerinize Google Calendar rezervasyon embed URL'i olarak `VITE_GOOGLE_CALENDAR_EMBED_URL` ekleyin.",
    continueWhenReady:
      "Embed URL ayarlandiktan sonra rezervasyon alani burada gorunecektir.",
    afterPickSlot:
      "Bilesen icinden saat secimini tamamladiktan sonra onayi gormek icin buraya geri donun.",
    bookedCta: "Gorusmemi planladim ->",
    iframeTitle: "Kesif gorusmesi takvimi",
    turkey: "Turkiye",
  },
} as const;

function getTzLabel(lang: "en" | "tr") {
  const now = new Date();
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    timeZoneName: "shortOffset",
  }).formatToParts(now);

  const offset = parts.find((p) => p.type === "timeZoneName")?.value ?? "";
  const isTurkeyLike = timeZone.toLowerCase().includes("istanbul") || timeZone.toLowerCase().includes("turkey");
  const country = isTurkeyLike ? PAGE_COPY[lang].turkey : timeZone;

  return {
    timeZone,
    label: offset ? `${offset} ${country}` : country,
  };
}

function normalizeEmbedUrl(raw?: string) {
  const value = (raw ?? "").trim();
  if (!value) return "";

  // If full iframe markup is pasted, extract the src attribute.
  const iframeSrc = value.match(/<iframe[^>]*\ssrc=["']([^"']+)["'][^>]*>/i)?.[1];
  return iframeSrc?.trim() || value;
}

export default function DiscoveryCallCalendar() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { lang } = useLanguage();
  const copy = PAGE_COPY[lang];
  const payload = useMemo(() => (state as Payload) ?? {}, [state]);
  const booked = searchParams.get("booked") === "1";

  const tz = useMemo(() => getTzLabel(lang), [lang]);

  const calendarEmbedUrl = normalizeEmbedUrl(
    import.meta.env.VITE_GOOGLE_CALENDAR_EMBED_URL as string | undefined
  );

  // Add theme query param when provider supports it.
  const calendarEmbedUrlThemed = useMemo(() => {
    try {
      const u = new URL(calendarEmbedUrl);
      u.searchParams.set("theme", "light");
      return u.toString();
    } catch {
      return calendarEmbedUrl;
    }
  }, [calendarEmbedUrl]);

  return (
    <div className="min-h-screen bg-background">
      <header className="pt-24 pb-10">
        <div className="container max-w-[980px] px-6">
          <h1 className="font-serif text-display text-foreground">
            {copy.title}
          </h1>
          <p className="text-muted-foreground mt-3">
            {copy.subtitle}
          </p>
        </div>
      </header>

      <main className="container max-w-[980px] px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="text-sm text-muted-foreground">{copy.duration}</div>
            <div className="mt-2 font-semibold text-foreground">{copy.durationValue}</div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="text-sm text-muted-foreground">{copy.selectDate}</div>
            <div className="mt-2 font-semibold text-foreground">{copy.below}</div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="text-sm text-muted-foreground">{copy.timezone}</div>
            <div className="mt-2 font-semibold text-foreground">🌍 {tz.label}</div>
          </div>
        </div>

        {booked ? (
          <section className="rounded-2xl border border-border bg-card p-7">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 text-accent" />
              <div>
                <h2 className="text-lg font-semibold text-foreground">{copy.bookedTitle}</h2>
                <p className="text-muted-foreground mt-2">
                  {copy.bookedSubtitle}
                </p>
              </div>
            </div>

            <p className="text-muted-foreground mt-6">
              {copy.bookedBody}
            </p>

            <div className="mt-7 flex gap-3 flex-wrap">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="px-6 py-3 rounded-lg border border-border text-foreground hover:bg-muted/40 transition-colors"
              >
                {copy.backToSite}
              </button>
            </div>
          </section>
        ) : (
          <section className="rounded-2xl border border-border bg-card p-5">
            {!calendarEmbedUrl ? (
              <div className="p-6">
                <h2 className="font-semibold text-foreground">{copy.notConfigured}</h2>
                <p className="text-muted-foreground mt-2">
                  {copy.setEnv}
                </p>
                <p className="text-muted-foreground mt-3">
                  {copy.continueWhenReady}
                </p>
              </div>
            ) : (
              <iframe
                title={copy.iframeTitle}
                src={calendarEmbedUrlThemed}
                className="w-full"
                // Iframe dışındaki boşluklar/placeholder alanları beyaz görünsün.
                style={{ height: 650, border: 0, background: "#ffffff" }}
              />
            )}

            <div className="mt-6 flex items-center justify-between gap-4 flex-wrap">
              <p className="text-muted-foreground text-sm">
                {copy.afterPickSlot}
              </p>
              <button
                type="button"
                onClick={() => {
                  const p = new URLSearchParams(searchParams);
                  p.set("booked", "1");
                  navigate(`/book-demo/calendar?${p.toString()}`, { state: payload });
                }}
                className="px-6 py-3 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 transition-colors font-semibold"
              >
                {copy.bookedCta}
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

