import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

const TOTAL_DURATION_MS = 10_000;

type StepStatus = "pending" | "running" | "done";

interface StepItem {
  label: string;
  status: StepStatus;
}

export default function InitializingPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const copy = useMemo(() => t.initializingScreen, [t.initializingScreen]);

  const businessType =
    (location.state as { businessType?: string } | null)?.businessType ?? "hotel";

  const stepLabels = useMemo(
    () =>
      businessType === "restaurant" ? copy.stepsRestaurant : copy.stepsHotel,
    [businessType, copy],
  );

  const [steps, setSteps] = useState<StepItem[]>(() =>
    stepLabels.map((label, i) => ({
      label,
      status: i === 0 ? "running" : "pending",
    })),
  );
  const [statusText, setStatusText] = useState(copy.statusBooting);
  const [whiteOut, setWhiteOut] = useState(false);

  useEffect(() => {
    const count = stepLabels.length;
    const perStep = TOTAL_DURATION_MS / (count + 1);
    const timers: ReturnType<typeof setTimeout>[] = [];

    for (let i = 0; i < count; i++) {
      timers.push(
        setTimeout(() => {
          setSteps((prev) =>
            prev.map((s, idx) => {
              if (idx === i) return { ...s, status: "done" };
              if (idx === i + 1) return { ...s, status: "running" };
              return s;
            }),
          );
        }, perStep * (i + 1)),
      );
    }

    timers.push(
      setTimeout(() => {
        setStatusText(copy.statusReady);
      }, perStep * count),
    );

    timers.push(
      setTimeout(() => {
        setWhiteOut(true);
      }, TOTAL_DURATION_MS - 800),
    );

    timers.push(
      setTimeout(() => {
        navigate("/home", { replace: true });
      }, TOTAL_DURATION_MS),
    );

    return () => timers.forEach(clearTimeout);
  }, [stepLabels, copy, navigate]);

  const initials = businessType === "restaurant" ? "R" : "H";

  return (
    <main className="relative flex h-dvh max-h-dvh min-h-0 flex-col overflow-hidden bg-background px-4 py-3 font-sans text-foreground antialiased sm:px-8 sm:py-4">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-accent/5" />

      {/* Single-column layout: fits one viewport without scroll */}
      <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center gap-3 sm:gap-5 [@media(max-height:720px)]:gap-2 [@media(max-height:640px)]:origin-center [@media(max-height:640px)]:scale-[0.94]">
        {/* Pulse Hero */}
        <div className="flex w-full max-w-2xl shrink-0 flex-col items-center text-center">
          <div className="relative mb-4 flex h-[9rem] w-[9rem] shrink-0 items-center justify-center sm:mb-5 sm:h-[10.5rem] sm:w-[10.5rem]">
            <Ring className="h-24 w-24" delay={0} />
            <Ring className="h-24 w-24" delay={1.3} />
            <Ring className="h-24 w-24" delay={2.6} />
            <div className="relative z-20 flex h-16 w-16 items-center justify-center rounded-full bg-card shadow-[0_0_48px_rgba(16,185,129,0.18)] sm:h-[4.5rem] sm:w-[4.5rem]">
              <span className="text-3xl font-extrabold tracking-tighter text-accent sm:text-4xl">
                {initials}
              </span>
            </div>
          </div>

          <div className="max-w-xl space-y-3 sm:space-y-4">
            <h1 className="text-balance text-3xl font-extrabold leading-[1.12] tracking-tighter sm:text-4xl md:text-[2.75rem] md:leading-tight">
              {copy.headline}{" "}
              <br />
              <span className="text-accent">{copy.headlineHighlight}</span>
            </h1>
            <p className="text-pretty text-sm font-medium leading-relaxed text-muted-foreground sm:text-base">
              {businessType === "restaurant" ? copy.descRestaurant : copy.descHotel}
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="w-full max-w-xl shrink-0 space-y-2 sm:space-y-2.5">
          {steps.map((step) => (
            <div
              key={step.label}
              className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 backdrop-blur-sm transition-all duration-500 sm:gap-3.5 sm:px-4 sm:py-3 ${
                step.status === "running"
                  ? "border-accent/20 bg-accent/5"
                  : step.status === "done"
                    ? "border-accent/10 bg-card/50"
                    : "border-border/10 bg-card/30 opacity-40"
              }`}
            >
              {step.status === "done" && (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-accent" />
              )}
              {step.status === "running" && (
                <Loader2 className="h-5 w-5 shrink-0 animate-spin text-accent" />
              )}
              {step.status === "pending" && <div className="h-5 w-5 shrink-0" />}
              <span
                className={`text-left text-xs font-semibold leading-snug sm:text-sm ${
                  step.status === "running"
                    ? "bg-gradient-to-r from-foreground via-accent to-foreground bg-[length:200%_auto] bg-clip-text text-transparent animate-shimmer"
                    : ""
                }`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>

        {/* Status Bar */}
        <div className="w-full max-w-2xl shrink-0 px-1">
          <div className="flex flex-col items-center">
            <div className="mb-3 h-px w-full bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
            <div className="flex max-w-full items-center gap-2.5 rounded-full border border-accent/10 bg-accent/5 px-4 py-2 sm:gap-3 sm:px-6 sm:py-2.5">
              <div className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-accent shadow-[0_0_8px_hsl(var(--accent))]" />
              <p className="text-center text-[10px] font-bold uppercase leading-tight tracking-[0.08em] text-accent sm:text-xs sm:tracking-[0.1em]">
                {statusText}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* White-out overlay */}
      <div
        className={`fixed inset-0 bg-background z-[100] pointer-events-none transition-opacity duration-700 ${
          whiteOut ? "opacity-100" : "opacity-0"
        }`}
      />
    </main>
  );
}

function Ring({ delay, className }: { delay: number; className?: string }) {
  return (
    <div
      className={`absolute rounded-full border border-accent ${className ?? "h-32 w-32"}`}
      style={{
        animation: `ripple 4s cubic-bezier(0,0.2,0.8,1) ${delay}s infinite`,
      }}
    />
  );
}
