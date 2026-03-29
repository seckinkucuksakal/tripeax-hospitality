import { type FormEvent, useMemo, useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "@/lib/LanguageContext";
import { useAuth } from "@/lib/AuthContext";
import { supabase } from "@/lib/supabase";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";

const RESEND_COOLDOWN_SECONDS = 60;

export default function VerifyOtpPage() {
  const { t, lang, setLang } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { session, loading: authLoading } = useAuth();

  const email = (location.state as { email?: string } | null)?.email ?? "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const copy = useMemo(() => t.auth, [t.auth]);

  useEffect(() => {
    if (!email) {
      navigate("/auth", { replace: true });
    }
  }, [email, navigate]);

  useEffect(() => {
    if (!authLoading && session) {
      navigate("/business-selection", { replace: true });
    }
  }, [authLoading, session, navigate]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleVerify = useCallback(
    async (e?: FormEvent<HTMLFormElement>) => {
      e?.preventDefault();
      if (otp.length !== 8) return;

      setError(null);
      setInfo(null);
      setSubmitting(true);

      try {
        const { error: verifyError } = await supabase.auth.verifyOtp({
          email,
          token: otp,
          type: "signup",
        });

        if (verifyError) {
          setError(copy.otpInvalid);
          setOtp("");
          return;
        }
      } catch {
        setError(copy.submitErrorGeneric);
      } finally {
        setSubmitting(false);
      }
    },
    [otp, email, copy],
  );

  async function handleResend() {
    if (cooldown > 0) return;
    setError(null);
    setInfo(null);

    const { error: resendError } = await supabase.auth.resend({
      type: "signup",
      email,
    });

    if (resendError) {
      setError(resendError.message);
      return;
    }

    setInfo(copy.otpResent);
    setCooldown(RESEND_COOLDOWN_SECONDS);
  }

  function handleOtpChange(value: string) {
    setOtp(value);
    setError(null);
  }

  useEffect(() => {
    if (otp.length === 8 && !submitting) {
      handleVerify();
    }
  }, [otp, submitting, handleVerify]);

  return (
    <main className="flex min-h-screen bg-background text-foreground">
      {/* Left Side */}
      <section className="hidden lg:flex lg:w-1/2 bg-accent relative overflow-hidden flex-col justify-center p-16">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-black/10 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-white text-2xl font-extrabold tracking-tight">Tripeax</span>
          </div>
          <h1 className="text-white text-5xl font-bold leading-tight mb-8 tracking-tight max-w-xl">{copy.leftTitle}</h1>
          <p className="text-white/80 text-2xl font-medium leading-relaxed max-w-xl">{copy.leftSubtitle}</p>
        </div>
      </section>

      {/* Right Side */}
      <section className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 md:p-16 bg-background relative">
        {/* Language Toggle */}
        <div className="absolute top-8 right-8 flex items-center rounded-lg border border-border overflow-hidden text-sm">
          <button
            type="button"
            onClick={() => setLang("en")}
            className={`px-3 py-1.5 font-medium transition-colors ${
              lang === "en"
                ? "bg-foreground text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLang("tr")}
            className={`px-3 py-1.5 font-medium transition-colors ${
              lang === "tr"
                ? "bg-foreground text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            TR
          </button>
        </div>

        <div className="max-w-md w-full">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <span className="text-accent text-xl font-bold tracking-tight">Tripeax</span>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-bold text-foreground tracking-tight mb-2">
              {copy.otpTitle}
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              {copy.otpSubtitle}{" "}
              <span className="text-foreground font-semibold">{email}</span>
            </p>
          </div>

          {error ? (
            <div className="mb-5 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive font-semibold">
              {error}
            </div>
          ) : null}

          {info ? (
            <div className="mb-5 rounded-lg border border-accent/30 bg-accent/5 px-4 py-3 text-sm text-accent font-semibold">
              {info}
            </div>
          ) : null}

          <form className="space-y-8" onSubmit={handleVerify}>
            <div className="flex justify-center">
              <InputOTP
                maxLength={8}
                value={otp}
                onChange={handleOtpChange}
                disabled={submitting}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} className="h-12 w-12 text-lg font-bold bg-card ring-1 ring-border/30" />
                  <InputOTPSlot index={1} className="h-12 w-12 text-lg font-bold bg-card ring-1 ring-border/30" />
                  <InputOTPSlot index={2} className="h-12 w-12 text-lg font-bold bg-card ring-1 ring-border/30" />
                  <InputOTPSlot index={3} className="h-12 w-12 text-lg font-bold bg-card ring-1 ring-border/30" />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={4} className="h-12 w-12 text-lg font-bold bg-card ring-1 ring-border/30" />
                  <InputOTPSlot index={5} className="h-12 w-12 text-lg font-bold bg-card ring-1 ring-border/30" />
                  <InputOTPSlot index={6} className="h-12 w-12 text-lg font-bold bg-card ring-1 ring-border/30" />
                  <InputOTPSlot index={7} className="h-12 w-12 text-lg font-bold bg-card ring-1 ring-border/30" />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <button
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold py-4 rounded-lg transition-all duration-200 shadow-lg shadow-accent/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              type="submit"
              disabled={submitting || otp.length !== 8}
            >
              {submitting ? copy.successRedirectText : copy.otpVerify}
            </button>

            <p className="text-center text-sm text-muted-foreground">
              {copy.otpResend}{" "}
              <button
                type="button"
                className="text-accent font-bold hover:underline underline-offset-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline"
                disabled={cooldown > 0}
                onClick={handleResend}
              >
                {cooldown > 0
                  ? `${copy.otpResendLink} (${cooldown}s)`
                  : copy.otpResendLink}
              </button>
            </p>
          </form>

          <div className="mt-12 pt-8 flex flex-wrap justify-center gap-6 text-[0.6875rem] font-medium uppercase tracking-[0.05em] text-muted-foreground/70">
            <a className="hover:text-accent transition-colors" href="#">
              {copy.footerLinkPrivacy}
            </a>
            <a className="hover:text-accent transition-colors" href="#">
              {copy.footerLinkTerms}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
