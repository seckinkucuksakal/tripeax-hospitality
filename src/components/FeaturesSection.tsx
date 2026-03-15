import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
};

const FeaturesSection = () => {
  const { t } = useLanguage();
  const [tab, setTab] = useState<"restaurants" | "hotels">("restaurants");
  const features = tab === "restaurants" ? t.features.restaurantFeatures : t.features.hotelFeatures;

  // Differentiators first
  const sorted = [...features].sort((a, b) => (b.differentiator ? 1 : 0) - (a.differentiator ? 1 : 0));

  return (
    <section id="features" className="py-24">
      <div className="container">
        <div className="text-center mb-12">
          <span className="text-[13px] font-semibold tracking-[0.1em] uppercase text-accent">
            {t.features.eyebrow}
          </span>
          <h2 className="font-serif text-display text-foreground mt-4">
            {t.features.headline}
          </h2>
          <p className="text-base text-muted-foreground mt-3">{t.features.subhead}</p>
        </div>

        {/* Toggle */}
        <div className="flex justify-center mb-12">
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
                {v === "restaurants" ? t.features.restaurants : t.features.hotels}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            variants={stagger}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {sorted.map((f, i) => (
              <motion.div
                key={`${tab}-${i}`}
                variants={fadeUp}
                className={`rounded-2xl p-7 transition-all duration-300 cursor-default ${
                  f.differentiator
                    ? "bg-foreground text-primary-foreground border-2 border-accent hover:border-accent/70 shadow-lg"
                    : "bg-card border border-border hover:border-accent hover:-translate-y-1 hover:shadow-lg"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-[28px]">{f.icon}</span>
                  {f.differentiator && (
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-accent text-accent-foreground px-2 py-0.5 rounded">
                      Exclusive
                    </span>
                  )}
                </div>
                <h3 className={`font-serif text-[19px] mt-3.5 mb-2 ${f.differentiator ? "text-primary-foreground" : "text-foreground"}`}>
                  {f.title}
                </h3>
                <p className={`text-sm leading-relaxed ${f.differentiator ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default FeaturesSection;
