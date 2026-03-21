import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { useBookDemoModal } from "@/lib/BookDemoModalContext";

const PainStats = () => {
  const { t } = useLanguage();
  const { openBookDemo } = useBookDemoModal();
  const [tab, setTab] = useState<"restaurants" | "hotels">("restaurants");
  const data = tab === "restaurants" ? t.painStats.restaurant : t.painStats.hotel;
  const notifications = tab === "restaurants" ? t.painStats.restaurantNotifications : t.painStats.hotelNotifications;

  return (
    <section className="bg-background py-16 md:py-0 md:min-h-[85vh] flex items-center border-none">
      <div className="container max-w-6xl w-full">
        {/* Toggle */}
        <div className="flex justify-center mb-12 md:mb-14">
          <div className="bg-secondary rounded-xl p-1 inline-flex">
            {(["restaurants", "hotels"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setTab(v)}
                className={`px-7 py-2.5 rounded-lg text-[15px] font-semibold transition-all duration-250 ${
                  tab === v
                    ? "bg-foreground text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {v === "restaurants" ? t.painStats.restaurantLabel : t.painStats.hotelLabel}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start"
          >
            {/* LEFT — Stats (60%) */}
            <div className="w-full lg:w-[60%]">
              <h2 className="font-serif text-display text-foreground mb-10">
                {t.painStats.headline}
              </h2>

              <div className="space-y-0">
                {data.map((stat, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-5 py-5 ${
                      i < data.length - 1 ? "border-b border-border" : ""
                    }`}
                  >
                    {/* Number */}
                    <span className="font-sans text-[2.5rem] md:text-[3rem] font-bold text-foreground leading-none tracking-tight min-w-[100px] md:min-w-[120px] shrink-0">
                      {stat.num}
                    </span>

                    {/* Emerald accent line */}
                    <div className="w-[3px] self-stretch bg-accent rounded-full shrink-0" />

                    {/* Description + source */}
                    <div>
                      <p className="text-muted-foreground text-base leading-relaxed">
                        {stat.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — Phone mockup (40%) */}
            <div className="w-full lg:w-[40%]">
              <div className="rounded-2xl border border-border bg-card shadow-lg overflow-hidden">
                {/* Card header */}
                <div className="px-5 py-4 border-b border-border">
                  <p className="text-xs text-muted-foreground font-medium">
                    {t.painStats.notificationHeader}
                  </p>
                </div>

                {/* Notification rows */}
                <div className="divide-y divide-border">
                  {notifications.map((notif, i) => (
                    <div key={i} className="px-5 py-3.5 flex items-start gap-3">
                      {/* Red dot */}
                      <span className="mt-1.5 w-2 h-2 rounded-full bg-coral shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm text-foreground leading-snug">
                          <span className="text-muted-foreground font-mono text-xs mr-2">
                            {notif.time}
                          </span>
                          {notif.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Coral line below card */}
              <p className="text-coral text-sm font-semibold mt-4 text-center">
                {t.painStats.missedLine}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* CTA */}
        <div className="flex justify-center mt-12">
          <button
            type="button"
            onClick={openBookDemo}
            className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-lg text-base font-bold hover:bg-accent/90 transition-all shadow-lg shadow-accent/20"
          >
            {t.painStats.cta} <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default PainStats;
