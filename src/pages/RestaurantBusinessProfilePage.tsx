import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Search, Sparkles } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { OnboardingBottomNav } from "@/components/onboarding/OnboardingBottomNav";
import { OnboardingTopNav } from "@/components/onboarding/OnboardingTopNav";

type PriceKey = "budget" | "mid" | "upscale" | "fine";

export default function RestaurantBusinessProfilePage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const copy = useMemo(() => t.onboardingRestaurantProfile, [t.onboardingRestaurantProfile]);

  const step = 2;

  const [restaurantName, setRestaurantName] = useState("");
  const [address, setAddress] = useState("");
  const [cuisine, setCuisine] = useState<Record<number, boolean>>({});
  const [price, setPrice] = useState<PriceKey | null>(null);
  const [description, setDescription] = useState("");
  const [seats, setSeats] = useState("");
  const [langTurkish, setLangTurkish] = useState(false);
  const [langEnglish, setLangEnglish] = useState(true);
  const [langGerman, setLangGerman] = useState(false);
  const [langFrench, setLangFrench] = useState(false);
  const [langRussian, setLangRussian] = useState(false);
  const [langArabic, setLangArabic] = useState(false);
  const [otherLang, setOtherLang] = useState(false);
  const [otherLangText, setOtherLangText] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const cuisines = copy.cuisines;

  function toggleCuisine(i: number) {
    setCuisine((prev) => ({ ...prev, [i]: !prev[i] }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!price) {
      setFormError(copy.validationPriceRequired);
      return;
    }
    setFormError(null);
    navigate("/onboarding/restaurant/step-3", {
      state: {
        profile: {
          restaurantName,
          address,
          cuisine,
          price,
          description,
          seats,
          languages: { langTurkish, langEnglish, langGerman, langFrench, langRussian, langArabic, otherLang, otherLangText },
        },
      },
    });
  }

  return (
    <motion.div
      className="min-h-screen bg-background text-foreground selection:bg-accent/20"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <OnboardingTopNav step={step} />

      <main className="px-6 max-w-[760px] mx-auto pb-32 pt-6">
        <section className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight mb-3">{copy.headline}</h1>
          <p className="text-muted-foreground leading-relaxed">{copy.subhead}</p>
        </section>

        <form id="restaurant-business-profile-form" className="space-y-8" onSubmit={handleSubmit}>
          {formError ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive font-semibold">
              {formError}
            </div>
          ) : null}
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold flex items-center gap-1">
                {copy.restaurantName}
                <span className="text-destructive">*</span>
              </label>
              <input
                required
                className="w-full bg-card border-0 ring-1 ring-border/40 rounded-lg px-4 py-3 focus:ring-2 focus:ring-accent focus:outline-none transition-all placeholder:text-muted-foreground/60"
                placeholder="e.g. Blue Marine Grill"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold flex items-center gap-1">
                {copy.address}
                <MapPin className="h-4 w-4 text-accent shrink-0" />
              </label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <input
                  required
                  className="w-full bg-card border-0 ring-1 ring-border/40 rounded-lg pl-11 pr-4 py-3 focus:ring-2 focus:ring-accent focus:outline-none transition-all placeholder:text-muted-foreground/60"
                  placeholder="e.g. 123 Ocean Drive, Miami, FL"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-semibold">
                {copy.cuisineType} <span className="text-destructive">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-5 bg-card ring-1 ring-border/30 rounded-lg">
                {cuisines.map((label, i) => (
                  <label key={label} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-border text-accent focus:ring-accent/30"
                      checked={!!cuisine[i]}
                      onChange={() => toggleCuisine(i)}
                    />
                    <span className="text-sm text-muted-foreground group-hover:text-accent transition-colors">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-semibold">
                {copy.priceRange} <span className="text-destructive">*</span>
              </label>
              <div className="flex flex-wrap items-center p-1 bg-muted/60 rounded-lg gap-1 min-h-[48px]">
                {(
                  [
                    ["budget", copy.priceBudget],
                    ["mid", copy.priceMid],
                    ["upscale", copy.priceUpscale],
                    ["fine", copy.priceFineDining],
                  ] as const
                ).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setPrice(key);
                      setFormError(null);
                    }}
                    className={`flex-1 min-w-[72px] text-center py-2 text-xs font-semibold rounded-md transition-all ${
                      price === key
                        ? "bg-accent text-accent-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-background/80"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold">
                {copy.shortDescription} <span className="text-destructive">*</span>
              </label>
              <textarea
                required
                rows={3}
                className="w-full bg-card border-0 ring-1 ring-border/40 rounded-lg px-4 py-3 focus:ring-2 focus:ring-accent focus:outline-none resize-none placeholder:text-muted-foreground/60"
                placeholder="e.g. A vibrant beachfront spot serving fresh catch of the day..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 px-1">
                <Sparkles className="h-3.5 w-3.5 shrink-0 text-accent" />
                {copy.descriptionHint}
              </p>
            </div>
            <div className="flex flex-col gap-2 max-w-[200px]">
              <label className="text-sm font-semibold">
                {copy.totalSeats} <span className="text-destructive">*</span>
              </label>
              <input
                required
                min={1}
                type="number"
                className="w-full bg-card border-0 ring-1 ring-border/40 rounded-lg px-4 py-3 focus:ring-2 focus:ring-accent focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                placeholder="e.g. 50"
                value={seats}
                onChange={(e) => setSeats(e.target.value)}
              />
            </div>
          </div>

          <div className="p-6 rounded-xl bg-card ring-1 ring-border/30 shadow-sm relative overflow-hidden">
            <div className="absolute left-0 top-0 w-1 h-full bg-accent" />
            <label className="text-sm font-semibold block mb-4">
              {copy.languagesGuests} <span className="text-destructive">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-border text-accent focus:ring-accent/30"
                  checked={langTurkish}
                  onChange={(e) => setLangTurkish(e.target.checked)}
                />
                <span
                  className={`text-sm ${langTurkish ? "font-semibold text-accent" : "text-muted-foreground group-hover:text-accent"} transition-colors`}
                >
                  {copy.langTurkish}
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-border text-accent focus:ring-accent/30"
                  checked={langEnglish}
                  onChange={(e) => setLangEnglish(e.target.checked)}
                />
                <span
                  className={`text-sm ${langEnglish ? "font-semibold text-accent" : "text-muted-foreground group-hover:text-accent"} transition-colors`}
                >
                  {copy.langEnglish}
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-border text-accent focus:ring-accent/30"
                  checked={langGerman}
                  onChange={(e) => setLangGerman(e.target.checked)}
                />
                <span
                  className={`text-sm ${langGerman ? "font-semibold text-accent" : "text-muted-foreground group-hover:text-accent"} transition-colors`}
                >
                  {copy.langGerman}
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-border text-accent focus:ring-accent/30"
                  checked={langFrench}
                  onChange={(e) => setLangFrench(e.target.checked)}
                />
                <span
                  className={`text-sm ${langFrench ? "font-semibold text-accent" : "text-muted-foreground group-hover:text-accent"} transition-colors`}
                >
                  {copy.langFrench}
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-border text-accent focus:ring-accent/30"
                  checked={langRussian}
                  onChange={(e) => setLangRussian(e.target.checked)}
                />
                <span
                  className={`text-sm ${langRussian ? "font-semibold text-accent" : "text-muted-foreground group-hover:text-accent"} transition-colors`}
                >
                  {copy.langRussian}
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-border text-accent focus:ring-accent/30"
                  checked={langArabic}
                  onChange={(e) => setLangArabic(e.target.checked)}
                />
                <span
                  className={`text-sm ${langArabic ? "font-semibold text-accent" : "text-muted-foreground group-hover:text-accent"} transition-colors`}
                >
                  {copy.langArabic}
                </span>
              </label>
              <div className="col-span-2 sm:col-span-3">
                <label className="flex items-center gap-3 cursor-pointer group mb-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-border text-accent focus:ring-accent/30"
                    checked={otherLang}
                    onChange={(e) => setOtherLang(e.target.checked)}
                  />
                  <span className="text-sm text-muted-foreground italic group-hover:text-accent">{copy.otherLanguage}</span>
                </label>
                {otherLang ? (
                  <input
                    className="w-full mt-2 bg-muted/40 border-0 ring-1 ring-border/40 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-accent focus:outline-none placeholder:text-muted-foreground/50"
                    placeholder={copy.otherLanguagePlaceholder}
                    value={otherLangText}
                    onChange={(e) => setOtherLangText(e.target.value)}
                  />
                ) : null}
              </div>
            </div>
          </div>

        </form>
      </main>

      <OnboardingBottomNav
        backLabel={copy.back}
        continueLabel={copy.continue}
        onBack={() => navigate("/business-selection")}
        formId="restaurant-business-profile-form"
      />
    </motion.div>
  );
}
