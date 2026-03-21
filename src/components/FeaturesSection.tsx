import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import {
  Phone,
  Globe,
  Crosshair,
  PhoneCall,
  Star,
  BarChart3,
  Moon,
  TrendingUp,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  "📱": Phone,
  "🌍": Globe,
  "🎯": Crosshair,
  "📞": PhoneCall,
  "⭐": Star,
  "📊": BarChart3,
  "🌙": Moon,
  "💰": TrendingUp,
};

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const } },
};

const FeaturesSection = () => {
  const { t } = useLanguage();
  const [tab, setTab] = useState<"restaurants" | "hotels">("restaurants");
  const features = tab === "restaurants" ? t.features.restaurantFeatures : t.features.hotelFeatures;

  return (
    <section id="features" className="py-24 bg-background">
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
            {features.map((f, i) => {
              const IconComp = iconMap[f.icon] || Phone;
              return (
                <motion.div
                  key={`${tab}-${i}`}
                  variants={fadeUp}
                  className={`relative rounded-2xl p-7 bg-card border-2 transition-all duration-300 cursor-default hover:-translate-y-1 ${
                    f.differentiator
                      ? "border-accent shadow-[0_0_0_1px_hsl(var(--accent)),0_8px_30px_-4px_hsl(var(--accent)/0.25)]"
                      : "border-accent/40 shadow-[0_0_0_1px_hsl(var(--accent)/0.3),0_8px_24px_-6px_hsl(var(--accent)/0.15)]"
                  } hover:shadow-[0_0_0_2px_hsl(var(--accent)),0_12px_36px_-4px_hsl(var(--accent)/0.3)]`}
                >
                  {/* Exclusivity ribbon */}
                  {f.differentiator && (
                    <div className="absolute -top-px -right-px">
                      <div className="bg-accent text-accent-foreground text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-lg rounded-tr-xl">
                        ✦ Exclusive
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      f.differentiator ? "bg-accent/15" : "bg-accent/10"
                    }`}>
                      <IconComp className="h-5 w-5 text-accent" />
                    </div>
                    <h3 className="font-serif text-[19px] text-foreground">
                      {f.title}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {f.desc}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default FeaturesSection;
