import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";

const HowItWorks = () => {
  const { t } = useLanguage();
  const [tab, setTab] = useState<"restaurants" | "hotels">("restaurants");
  const data = tab === "restaurants" ? t.howItWorks.restaurant : t.howItWorks.hotel;

  return (
    <section id="how-it-works" className="py-24 bg-secondary">
      <div className="container max-w-5xl">
        <div className="text-center mb-6">
          <h2 className="font-serif text-display text-foreground">
            {t.howItWorks.headline}
          </h2>
        </div>

        {/* Tab toggle */}
        <div className="flex justify-center gap-2 mb-12">
          {(["restaurants", "hotels"] as const).map((key) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                tab === key
                  ? "bg-accent text-accent-foreground shadow-md"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {key === "restaurants" ? t.howItWorks.restaurantLabel : t.howItWorks.hotelLabel}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
          >
            {/* Left phone — Without */}
            <div className="rounded-3xl border border-destructive/20 bg-card overflow-hidden shadow-lg opacity-80">
              <div className="bg-destructive/10 px-6 py-4 border-b border-destructive/20">
                <h3 className="font-serif text-lg text-destructive font-semibold">
                  {data.without.label}
                </h3>
              </div>
              <div className="p-5 space-y-0">
                {data.without.items.map((item, i) => (
                  <div
                    key={i}
                    className={`flex gap-3 py-3 ${i < data.without.items.length - 1 ? "border-b border-border" : ""}`}
                  >
                    <span className="text-xs font-mono text-muted-foreground whitespace-nowrap pt-0.5 w-12 shrink-0">
                      {item.time}
                    </span>
                    <div className="flex items-start gap-2 min-w-0">
                      <span className="text-base shrink-0">{item.icon}</span>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right phone — With */}
            <div className="rounded-3xl border border-accent/30 bg-card overflow-hidden shadow-lg">
              <div className="bg-accent/10 px-6 py-4 border-b border-accent/20">
                <h3 className="font-serif text-lg text-accent font-semibold">
                  {data.with.label}
                </h3>
              </div>
              <div className="p-5 space-y-0">
                {data.with.items.map((item, i) => (
                  <div
                    key={i}
                    className={`flex gap-3 py-3 ${i < data.with.items.length - 1 ? "border-b border-border" : ""}`}
                  >
                    <span className="text-xs font-mono text-muted-foreground whitespace-nowrap pt-0.5 w-12 shrink-0">
                      {item.time}
                    </span>
                    <div className="flex items-start gap-2 min-w-0">
                      <span className="text-base shrink-0">{item.icon}</span>
                      <p className="text-sm text-foreground leading-relaxed">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <p className="text-center text-muted-foreground mt-10 text-base">
          {t.howItWorks.bottomLine}
        </p>
      </div>
    </section>
  );
};

export default HowItWorks;
