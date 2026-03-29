import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertCircle, Check, Loader2 } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DEMO_PAYMENT_COMPLETE_KEY } from "@/lib/demo-payment";

type PlanId = "starter" | "professional";

export default function PaymentPage() {
  const { lang, setLang, t } = useLanguage();
  const navigate = useNavigate();
  const copy = useMemo(() => t.paymentPage, [t.paymentPage]);

  const [plan, setPlan] = useState<PlanId>("professional");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [simulateFail, setSimulateFail] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(DEMO_PAYMENT_COMPLETE_KEY) === "1") {
        navigate("/business-selection", { replace: true });
      }
    } catch {
      /* ignore */
    }
  }, [navigate]);

  function runDummyCheckout() {
    setError(null);
    setSubmitting(true);
    const fail = import.meta.env.DEV && simulateFail;

    window.setTimeout(() => {
      setSubmitting(false);
      if (fail) {
        setError(copy.errorGeneric);
        return;
      }
      try {
        localStorage.setItem(DEMO_PAYMENT_COMPLETE_KEY, "1");
      } catch {
        /* ignore */
      }
      navigate("/business-selection");
    }, 1400);
  }

  const plans: {
    id: PlanId;
    name: string;
    desc: string;
    price: string;
    features: string[];
    highlight?: boolean;
  }[] = [
    {
      id: "starter",
      name: copy.starterName,
      desc: copy.starterDesc,
      price: copy.priceStarter,
      features: Array.isArray(copy.starterFeatures) ? copy.starterFeatures : [],
    },
    {
      id: "professional",
      name: copy.professionalName,
      desc: copy.professionalDesc,
      price: copy.priceProfessional,
      features: Array.isArray(copy.professionalFeatures) ? copy.professionalFeatures : [],
      highlight: true,
    },
  ];

  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex max-w-[960px] flex-wrap items-center justify-between gap-3 px-6 py-5">
          <span className="text-xl font-extrabold tracking-tight text-accent">Tripeax</span>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/auth"
              className="text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              {copy.backToAuth}
            </Link>
            <div
              className="flex items-center overflow-hidden rounded-lg border border-border text-sm shadow-sm"
              role="group"
              aria-label="Language"
            >
              <button
                type="button"
                aria-pressed={lang === "en"}
                onClick={() => setLang("en")}
                className={cn(
                  "min-h-10 min-w-[44px] px-3 py-2 font-semibold transition-colors",
                  lang === "en"
                    ? "bg-foreground text-primary-foreground"
                    : "bg-background text-muted-foreground hover:text-foreground",
                )}
              >
                EN
              </button>
              <button
                type="button"
                aria-pressed={lang === "tr"}
                onClick={() => setLang("tr")}
                className={cn(
                  "min-h-10 min-w-[44px] border-l border-border px-3 py-2 font-semibold transition-colors",
                  lang === "tr"
                    ? "bg-foreground text-primary-foreground"
                    : "bg-background text-muted-foreground hover:text-foreground",
                )}
              >
                TR
              </button>
            </div>
          </div>
        </div>
      </header>

      <motion.div
        className="flex flex-1 flex-col items-center justify-center px-6 py-12"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="w-full max-w-[1120px]">
          <header className="mb-10 text-center">
            <h1 className="mb-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {copy.headline}
            </h1>
            <p className="mx-auto max-w-xl text-pretty text-muted-foreground">{copy.subhead}</p>
          </header>

          {error ? (
            <Alert variant="destructive" className="mb-8">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="font-medium">{copy.errorGeneric}</AlertDescription>
            </Alert>
          ) : null}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-stretch">
            {plans.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setPlan(p.id);
                  setError(null);
                }}
                disabled={submitting}
                className={cn(
                  "group relative flex flex-col rounded-xl border-2 bg-card p-6 text-left transition-all duration-300 sm:p-8",
                  "hover:border-accent/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
                  plan === p.id ? "border-accent bg-accent/[0.03] shadow-[0_0_0_1px_hsl(var(--accent))]" : "border-border",
                  submitting && "pointer-events-none opacity-70",
                )}
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="mb-3 flex flex-wrap items-baseline gap-1">
                      <span className="text-3xl font-extrabold tracking-tight text-foreground">{p.price}</span>
                      <span className="text-sm font-medium text-muted-foreground">{copy.perMonth}</span>
                    </div>
                    <h3 className="text-xl font-bold text-foreground">{p.name}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    {p.highlight ? (
                      <span className="rounded-full bg-accent px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-accent-foreground">
                        {copy.popular}
                      </span>
                    ) : null}
                    {plan === p.id ? (
                      <span
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground"
                        aria-hidden
                      >
                        <Check className="h-4 w-4" strokeWidth={3} />
                      </span>
                    ) : null}
                  </div>
                </div>
                <ul className="mt-auto space-y-2 border-t border-border/60 pt-5">
                  {p.features.map((f, i) => (
                    <li
                      key={`${p.id}-${i}`}
                      className="flex items-start gap-2 text-sm leading-snug text-foreground"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </button>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center gap-4">
            {import.meta.env.DEV ? (
              <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={simulateFail}
                  onChange={(e) => setSimulateFail(e.target.checked)}
                  className="rounded border-border"
                />
                {copy.demoSimulateFail}
              </label>
            ) : null}

            <Button
              type="button"
              size="lg"
              className="min-h-12 min-w-[min(100%,280px)] px-10 text-base font-semibold"
              disabled={submitting}
              onClick={runDummyCheckout}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {copy.processing}
                </>
              ) : (
                copy.proceedCta
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
