import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Hotel, UtensilsCrossed } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { OnboardingTopNav } from "@/components/onboarding/OnboardingTopNav";

type BusinessType = "restaurant" | "hotel";

export default function BusinessSelectionPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const copy = useMemo(() => t.businessSelection, [t.businessSelection]);

  const [selected, setSelected] = useState<BusinessType | null>(null);
  const [isLeaving, setIsLeaving] = useState(false);

  function continueToNext() {
    if (!selected) return;
    setIsLeaving(true);
    const path =
      selected === "restaurant"
        ? "/onboarding/business-profile/restaurant"
        : "/onboarding/business-profile/hotel";
    window.setTimeout(() => navigate(path), 320);
  }

  return (
    <main className="bg-background min-h-screen flex flex-col">
      <OnboardingTopNav step={1} />

      {/* Main Content Canvas */}
      <motion.div
        className="flex-grow flex items-center justify-center px-6 py-12"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: isLeaving ? 0 : 1, y: isLeaving ? -14 : 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="w-full max-w-[760px] text-center relative">
          <header className="mb-12">
            <h1 className="text-[2.5rem] font-bold text-foreground leading-tight tracking-tight mb-4">
              {copy.headline}
            </h1>
            <p className="text-muted-foreground max-w-[860px] mx-auto whitespace-nowrap max-sm:whitespace-normal">
              {copy.subhead}
            </p>
          </header>

          {/* Selection Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch justify-center">
            <button
              type="button"
              onClick={() => setSelected("restaurant")}
              className={`group relative flex flex-col items-center text-center p-8 rounded-xl bg-card border-2 transition-all duration-300 active:scale-[0.98] ${
                selected === "restaurant" ? "border-accent" : "border-border"
              } hover:border-accent`}
            >
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent transition-colors duration-300">
                <UtensilsCrossed className="text-accent group-hover:text-white" size={36} />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">{copy.restaurant}</h3>
              <p className="text-muted-foreground text-sm">{copy.restaurantDesc}</p>
              {selected === "restaurant" ? (
                <div className="absolute top-4 right-4">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-accent text-accent-foreground">
                    ✓
                  </span>
                </div>
              ) : null}
            </button>

            <button
              type="button"
              onClick={() => setSelected("hotel")}
              className={`group relative flex flex-col items-center text-center p-8 rounded-xl bg-card border-2 transition-all duration-300 active:scale-[0.98] ${
                selected === "hotel" ? "border-accent" : "border-border"
              } hover:border-accent`}
            >
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent transition-colors duration-300">
                <Hotel className="text-accent group-hover:text-white" size={36} />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">{copy.hotel}</h3>
              <p className="text-muted-foreground text-sm">{copy.hotelDesc}</p>
              {selected === "hotel" ? (
                <div className="absolute top-4 right-4">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-accent text-accent-foreground">
                    ✓
                  </span>
                </div>
              ) : null}
            </button>
          </div>

          {/* Action Area */}
          <div className="mt-12">
            <button
              type="button"
              onClick={continueToNext}
              disabled={!selected}
              className="px-12 py-4 bg-accent text-accent-foreground font-bold rounded-lg hover:bg-accent/90 transition-all duration-300 active:scale-[0.98] shadow-lg shadow-accent/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {copy.continue}
            </button>
          </div>
        </div>
      </motion.div>
    </main>
  );
}

