import { useState } from "react";
import { Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import { useBookDemoModal } from "@/lib/BookDemoModalContext";
import { useNavigate } from "react-router-dom";

type Plan = {
  name?: string;
  subtitle?: string;
  description?: string;
  period?: string;
  cta?: string;
  features?: string[];
  priceEur?: number;
  priceTry?: number;
  price?: string;
};

type PricingTranslation = {
  headline: string;
  subhead: string;
  mostPopular: string;
  restaurantLabel?: string;
  hotelLabel?: string;
  perMonth?: string;
  everythingInPro?: string;
  bookDemo?: string;
  getStarted?: string;
  contactSales?: string;
  restaurant?: {
    starter?: Plan;
    professional?: Plan;
    enterprise?: Plan;
  };
  hotel?: {
    starter?: Plan;
    professional?: Plan;
    enterprise?: Plan;
  };
  starter?: Plan;
  professional?: Plan;
  enterprise?: Plan;
};

const PricingSection = () => {
  const { t, lang } = useLanguage();
  const { openBookDemo } = useBookDemoModal();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"restaurants" | "hotels">("restaurants");

  // The translation shape can vary (some versions provide `pricing.restaurant/hotel`,
  // others provide only `pricing.starter/professional/enterprise`).
  // Fallback to the base `pricing` object to avoid runtime crashes.
  const pricing = t.pricing as unknown as PricingTranslation;
  const plans = (tab === "restaurants" ? pricing.restaurant : pricing.hotel) ?? pricing;
  const starter = plans?.starter ?? pricing.starter;
  const professional = plans?.professional ?? pricing.professional;
  const enterprise = plans?.enterprise ?? pricing.enterprise;

  const formatPrice = (plan: Plan | undefined) => {
    // Newer schema: numeric EUR/TRY
    if (plan && "priceEur" in plan) {
      if (lang === "tr" && "priceTry" in plan && typeof plan.priceTry === "number") {
        return `₺${plan.priceTry.toLocaleString("tr-TR")}`;
      }
      if (typeof plan.priceEur === "number") return `€${plan.priceEur}`;
    }

    // Older schema: string `price` like "€199" or "Custom"
    if (typeof plan?.price === "string") return plan.price;
    return null;
  };

  const scrollToDemo = openBookDemo;

  const restaurantLabel =
    pricing.restaurantLabel ?? (lang === "tr" ? "Restoranlar" : "Restaurants");
  const hotelLabel = pricing.hotelLabel ?? (lang === "tr" ? "Oteller" : "Hotels");
  const perMonth =
    pricing.perMonth ?? starter?.period ?? (lang === "tr" ? "/ay" : "/mo");
  const getStarted =
    pricing.getStarted ??
    pricing.bookDemo ??
    starter?.cta ??
    professional?.cta ??
    (lang === "tr" ? "Hemen Başlayın" : "Get started");
  const contactSales =
    pricing.contactSales ??
    enterprise?.cta ??
    (lang === "tr" ? "Satışla İletişim" : "Contact Sales");
  const everythingInPro =
    pricing.everythingInPro ?? (lang === "tr" ? "Profesyonel paketinde her şey" : "Everything in Professional");

  return (
    <section id="pricing" className="py-24 bg-background">
      <div className="container max-w-[1200px]">
        {/* Header row */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-14 gap-6">
          <div>
            <h2 className="font-serif text-display text-foreground">
              {t.pricing.headline}
            </h2>
            <p className="text-base text-muted-foreground mt-2 max-w-lg">
              {t.pricing.subhead}
            </p>
          </div>
        </div>

        {/* Industry toggle */}
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
                {v === "restaurants" ? restaurantLabel : hotelLabel}
              </button>
            ))}
          </div>
        </div>

        {/* Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch"
          >
            {/* Starter */}
            <div className="bg-card rounded-2xl p-8 pt-10 border border-border flex flex-col order-2 md:order-1">
              <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {starter?.name}
              </span>
              <p className="text-sm text-muted-foreground mt-1 min-h-[40px]">
                {starter?.subtitle ?? starter?.description}
              </p>

              <div className="flex items-baseline gap-1 mt-6 mb-6">
                <span className="font-serif text-[48px] font-bold text-foreground leading-none">
                  {formatPrice(starter)}
                </span>
                <span className="text-muted-foreground text-base">{perMonth}</span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {(starter?.features ?? []).map((f: string) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check className="h-4 w-4 shrink-0 text-accent mt-0.5" />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => navigate("/auth?mode=register")}
                className="w-full py-3.5 rounded-lg text-[15px] font-semibold bg-accent text-accent-foreground hover:bg-accent/80 transition-all duration-200"
              >
                {getStarted}
              </button>
            </div>

            {/* Professional (highlighted) */}
            <div className="bg-card rounded-2xl p-8 pt-10 border-2 border-accent relative flex flex-col shadow-[0_0_40px_-8px_hsl(160_84%_39%/0.3)] order-1 md:order-2">
              {/* Badge */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-[11px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider whitespace-nowrap">
                {t.pricing.mostPopular}
              </div>

              <span className="text-sm font-semibold uppercase tracking-wider text-accent">
                {professional?.name}
              </span>
              <p className="text-sm text-muted-foreground mt-1 min-h-[40px]">
                {professional?.subtitle ?? professional?.description}
              </p>

              <div className="flex items-baseline gap-1 mt-6 mb-6">
                <span className="font-serif text-[48px] font-bold text-foreground leading-none">
                  {formatPrice(professional)}
                </span>
                <span className="text-muted-foreground text-base">{perMonth}</span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {(professional?.features ?? []).map((f: string) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check className="h-4 w-4 shrink-0 text-accent mt-0.5" />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => navigate("/auth?mode=register")}
                className="w-full py-3.5 rounded-lg text-[15px] font-semibold bg-accent text-accent-foreground hover:bg-accent/80 transition-all duration-200"
              >
                {getStarted}
              </button>
            </div>

            {/* Enterprise */}
            <div className="bg-card rounded-2xl p-8 pt-10 border border-border flex flex-col order-3">
              <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {enterprise?.name}
              </span>
              <p className="text-sm text-muted-foreground mt-1 min-h-[40px]">
                {enterprise?.subtitle ?? enterprise?.description}
              </p>

              <div className="flex items-baseline gap-1 mt-6 mb-6">
                <span className="font-serif text-[48px] font-bold text-foreground leading-none">
                  Custom
                </span>
              </div>

              <p className="text-xs font-semibold text-accent mb-3">
                {everythingInPro}
              </p>

              <ul className="space-y-3 mb-8 flex-1">
                {(enterprise?.features ?? []).map((f: string) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check className="h-4 w-4 shrink-0 text-accent mt-0.5" />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={scrollToDemo}
                className="w-full py-3.5 rounded-lg text-[15px] font-semibold border-2 border-border text-foreground hover:bg-secondary transition-all duration-200"
              >
                {contactSales}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default PricingSection;
