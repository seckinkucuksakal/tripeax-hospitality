import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { OnboardingBottomNav } from "@/components/onboarding/OnboardingBottomNav";
import { OnboardingTopNav } from "@/components/onboarding/OnboardingTopNav";
import { Switch } from "@/components/ui/switch";

type RatingKey = "r3" | "r4" | "r5" | "boutique" | "unrated";

export default function HotelBusinessProfilePage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const copy = useMemo(() => t.onboardingHotelProfile, [t.onboardingHotelProfile]);

  const step = 2;

  const [hotelName, setHotelName] = useState("");
  const [address, setAddress] = useState("");
  const [rating, setRating] = useState<RatingKey>("r4");
  const [rooms, setRooms] = useState("");
  const [description, setDescription] = useState("");
  const [chain, setChain] = useState(true);
  const [chainName, setChainName] = useState("");
  const [langTurkish, setLangTurkish] = useState(true);
  const [langEnglish, setLangEnglish] = useState(false);
  const [langGerman, setLangGerman] = useState(false);
  const [langFrench, setLangFrench] = useState(false);
  const [langRussian, setLangRussian] = useState(false);
  const [langArabic, setLangArabic] = useState(false);
  const [langOther, setLangOther] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    navigate("/onboarding/hotel/step-3", {
      state: {
        profile: {
          hotelName,
          address,
          rating,
          rooms,
          description,
          chain,
          chainName,
          languages: { langTurkish, langEnglish, langGerman, langFrench, langRussian, langArabic, langOther },
        },
      },
    });
  }

  const ratings: { key: RatingKey; label: string }[] = [
    { key: "r3", label: copy.rating3 },
    { key: "r4", label: copy.rating4 },
    { key: "r5", label: copy.rating5 },
    { key: "boutique", label: copy.ratingBoutique },
    { key: "unrated", label: copy.ratingUnrated },
  ];

  return (
    <motion.div
      className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <OnboardingTopNav step={step} />

      <main className="flex-grow px-6 pb-32 pt-6">
        <div className="max-w-[760px] mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-[2.5rem] font-bold text-foreground leading-tight mb-3">{copy.headline}</h1>
            <p className="text-muted-foreground text-lg">{copy.subhead}</p>
          </div>

          <form id="hotel-business-profile-form" className="space-y-8" onSubmit={handleSubmit}>
            <div className="bg-card p-8 rounded-lg shadow-sm ring-1 ring-border/30">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold">
                    {copy.hotelName} <span className="text-destructive">*</span>
                  </label>
                  <input
                    required
                    className="w-full bg-background border border-border/60 rounded-lg px-4 py-3 focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all placeholder:text-muted-foreground/50"
                    placeholder="Blue Marine Hotel"
                    value={hotelName}
                    onChange={(e) => setHotelName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold">
                    {copy.address} <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-accent pointer-events-none" />
                    <input
                      required
                      className="w-full bg-background border border-border/60 rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all placeholder:text-muted-foreground/50"
                      placeholder="123 Ocean Drive, Miami, FL"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-muted/40 p-8 rounded-lg space-y-8 ring-1 ring-border/20">
              <div className="space-y-3">
                <label className="block text-sm font-semibold">
                  {copy.starRating} <span className="text-destructive">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {ratings.map(({ key, label }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setRating(key)}
                      className={`px-5 py-2.5 rounded-full border text-sm font-medium transition-all ${
                        rating === key
                          ? "border-accent bg-accent text-accent-foreground shadow-sm"
                          : "border-border/50 bg-card text-foreground hover:bg-accent/10"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold">
                  {copy.totalRooms} <span className="text-destructive">*</span>
                </label>
                <input
                  required
                  min={1}
                  type="number"
                  className="w-full max-w-[200px] bg-background border border-border/60 rounded-lg px-4 py-3 focus:ring-2 focus:ring-accent outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="e.g. 72"
                  value={rooms}
                  onChange={(e) => setRooms(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold">
                  {copy.shortDescription}{" "}
                  <span className="text-muted-foreground font-normal text-xs ml-1">{copy.optional}</span>
                </label>
                <textarea
                  rows={2}
                  className="w-full bg-background border border-border/60 rounded-lg px-4 py-3 focus:ring-2 focus:ring-accent outline-none resize-none placeholder:text-muted-foreground/50"
                  placeholder="Boutique waterfront hotel with sea-view rooms and rooftop restaurant..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <label className="text-sm font-semibold">{copy.chainQuestion}</label>
                  <Switch checked={chain} onCheckedChange={setChain} className="data-[state=checked]:bg-accent" />
                </div>
                {chain ? (
                  <input
                    className="w-full bg-background border border-border/60 rounded-lg px-4 py-3 focus:ring-2 focus:ring-accent outline-none placeholder:text-muted-foreground/50"
                    placeholder={copy.chainPlaceholder}
                    value={chainName}
                    onChange={(e) => setChainName(e.target.value)}
                  />
                ) : null}
              </div>
            </div>

            <div className="bg-card p-8 rounded-lg space-y-4 ring-1 ring-border/30">
              <label className="block text-sm font-semibold">
                {copy.languagesGuests} <span className="text-destructive">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-border text-accent focus:ring-accent"
                    checked={langTurkish}
                    onChange={(e) => setLangTurkish(e.target.checked)}
                  />
                  <span className="text-sm text-foreground group-hover:text-accent transition-colors">{copy.langTurkish}</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-border text-accent focus:ring-accent"
                    checked={langEnglish}
                    onChange={(e) => setLangEnglish(e.target.checked)}
                  />
                  <span className="text-sm text-foreground group-hover:text-accent transition-colors">{copy.langEnglish}</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-border text-accent focus:ring-accent"
                    checked={langGerman}
                    onChange={(e) => setLangGerman(e.target.checked)}
                  />
                  <span className="text-sm text-foreground group-hover:text-accent transition-colors">{copy.langGerman}</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-border text-accent focus:ring-accent"
                    checked={langFrench}
                    onChange={(e) => setLangFrench(e.target.checked)}
                  />
                  <span className="text-sm text-foreground group-hover:text-accent transition-colors">{copy.langFrench}</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-border text-accent focus:ring-accent"
                    checked={langRussian}
                    onChange={(e) => setLangRussian(e.target.checked)}
                  />
                  <span className="text-sm text-foreground group-hover:text-accent transition-colors">{copy.langRussian}</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-border text-accent focus:ring-accent"
                    checked={langArabic}
                    onChange={(e) => setLangArabic(e.target.checked)}
                  />
                  <span className="text-sm text-foreground group-hover:text-accent transition-colors">{copy.langArabic}</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-border text-accent focus:ring-accent"
                    checked={langOther}
                    onChange={(e) => setLangOther(e.target.checked)}
                  />
                  <span className="text-sm text-foreground group-hover:text-accent transition-colors">{copy.langOther}</span>
                </label>
              </div>
            </div>

          </form>
        </div>
      </main>

      <OnboardingBottomNav
        backLabel={copy.back}
        continueLabel={copy.continue}
        onBack={() => navigate("/business-selection")}
        formId="hotel-business-profile-form"
      />
    </motion.div>
  );
}
