import { Check, X } from "lucide-react";
import { useBookDemoModal } from "@/lib/BookDemoModalContext";
import { useLanguage } from "@/lib/LanguageContext";

const PricingSection = () => {
  const { t } = useLanguage();
  const { openBookDemo } = useBookDemoModal();

  const plans = [t.pricing.starter, t.pricing.professional, t.pricing.enterprise];

  return (
    <section id="pricing" className="py-24 bg-secondary">
      <div className="container max-w-[1100px]">
        <div className="text-center mb-14">
          <span className="text-[13px] font-semibold tracking-[0.1em] uppercase text-accent">
            {t.pricing.eyebrow}
          </span>
          <h2 className="font-serif text-display text-foreground mt-4">
            {t.pricing.headline}
          </h2>
          <p className="text-base text-muted-foreground mt-2 max-w-lg mx-auto">
            {t.pricing.subhead}
          </p>
        </div>

        {/* Pricing comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-[700px] mx-auto mb-14">
          <div className="rounded-xl border border-border bg-card p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <X className="h-5 w-5 text-coral" />
              <span className="font-semibold text-foreground">{t.pricing.comparison.traditional.label}</span>
            </div>
            <p className="text-sm text-muted-foreground">{t.pricing.comparison.traditional.desc}</p>
          </div>
          <div className="rounded-xl border-2 border-accent bg-accent/5 p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Check className="h-5 w-5 text-accent" />
              <span className="font-semibold text-foreground">{t.pricing.comparison.tripeax.label}</span>
            </div>
            <p className="text-sm text-muted-foreground">{t.pricing.comparison.tripeax.desc}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {plans.map((plan, idx) => {
            const isPro = idx === 1;
            return (
              <div
                key={plan.name}
                className={`rounded-2xl p-9 flex flex-col relative ${
                  isPro
                    ? "bg-foreground border-2 border-accent shadow-2xl shadow-foreground/20"
                    : "bg-card border border-border"
                }`}
              >
                {isPro && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-[11px] font-bold px-4 py-1 rounded-md uppercase tracking-wide">
                    {t.pricing.mostPopular}
                  </div>
                )}

                <span className="text-[13px] font-semibold uppercase tracking-wide text-accent">
                  {plan.name}
                </span>

                <div className="flex items-baseline gap-1 mt-3 mb-1">
                  <span className={`font-serif text-[44px] ${isPro ? "text-primary-foreground" : "text-foreground"}`}>
                    {plan.price}
                  </span>
                  <span className={`text-[15px] ${isPro ? "text-primary-foreground/50" : "text-muted-foreground"}`}>
                    {plan.period}
                  </span>
                </div>

                <p className={`text-sm mb-2 ${isPro ? "text-accent" : "text-accent"}`}>
                  {plan.successFee}
                </p>
                <p className={`text-[13px] leading-relaxed mb-6 ${isPro ? "text-primary-foreground/50" : "text-muted-foreground"}`}>
                  {plan.description}
                </p>

                <ul className="space-y-2.5 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm">
                      <Check className={`h-4 w-4 shrink-0 ${isPro ? "text-accent" : "text-accent"}`} />
                      <span className={isPro ? "text-primary-foreground" : "text-foreground"}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={openBookDemo}
                  className={`w-full py-3.5 rounded-lg text-[15px] font-semibold transition-all duration-200 ${
                    isPro
                      ? "bg-accent text-accent-foreground hover:bg-accent/80"
                      : "border-2 border-foreground text-foreground hover:bg-foreground hover:text-primary-foreground"
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            );
          })}
        </div>

        {/* Fee explainer */}
        <div className="mt-10 bg-card rounded-2xl p-6 md:px-9 border-2 border-accent/20 flex items-start gap-5">
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
            <Check className="h-5 w-5 text-accent" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground mb-1">{t.pricing.feeExplainer.title}</p>
            <p className="text-[13px] text-muted-foreground leading-relaxed">{t.pricing.feeExplainer.desc}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
