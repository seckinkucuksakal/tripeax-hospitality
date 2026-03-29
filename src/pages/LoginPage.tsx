import type { FormEvent } from "react";
import { useMemo, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "@/lib/LanguageContext";
import { useAuth } from "@/lib/AuthContext";

export default function LoginPage() {
  const { t, lang, setLang } = useLanguage();
  const navigate = useNavigate();
  const { signIn, session, loading: authLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  const copy = useMemo(() => t.auth, [t.auth]);

  useEffect(() => {
    if (!authLoading && session) {
      navigate("/business-selection", { replace: true });
    }
  }, [authLoading, session, navigate]);

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setSubmitting(true);

    try {
      if (!email.trim()) {
        setError(copy.validationEmailRequired);
        return;
      }

      const { error: authError } = await signIn(email.trim(), password);

      if (authError) {
        setError(authError.message);
      }
    } catch {
      setError(copy.submitErrorGeneric);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleForgotPassword(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setSubmitting(true);

    try {
      if (!email.trim()) {
        setError(copy.validationEmailRequired);
        return;
      }

      setInfo(copy.forgotPasswordLocalHint);
    } catch {
      setError(copy.submitErrorGeneric);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen bg-background text-foreground">
      {/* Left Side — identical to AuthPage */}
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
              {showForgot ? copy.forgotPassword : copy.loginTitle}
            </h2>
            {!showForgot && (
              <p className="text-muted-foreground text-sm mt-1">{copy.loginSubtitle}</p>
            )}
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

          {showForgot ? (
            <form className="space-y-5" onSubmit={handleForgotPassword}>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 ml-1" htmlFor="reset_email">
                  {copy.emailAddress}
                </label>
                <input
                  className="w-full bg-card border-0 ring-1 ring-border/30 focus:ring-2 focus:ring-accent rounded-lg px-4 py-3.5 text-sm transition-all outline-none"
                  id="reset_email"
                  name="email"
                  placeholder="john@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold py-4 rounded-lg transition-all duration-200 mt-4 shadow-lg shadow-accent/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                type="submit"
                disabled={submitting}
              >
                {submitting ? copy.successRedirectText : copy.forgotPassword}
              </button>

              <p className="text-center text-sm text-muted-foreground mt-6">
                <button
                  type="button"
                  className="text-accent font-bold hover:underline underline-offset-4"
                  onClick={() => {
                    setShowForgot(false);
                    setError(null);
                    setInfo(null);
                  }}
                >
                  {copy.logInLink}
                </button>
              </p>
            </form>
          ) : (
            <form className="space-y-5" onSubmit={handleLogin}>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 ml-1" htmlFor="login_email">
                  {copy.emailAddress}
                </label>
                <input
                  className="w-full bg-card border-0 ring-1 ring-border/30 focus:ring-2 focus:ring-accent rounded-lg px-4 py-3.5 text-sm transition-all outline-none"
                  id="login_email"
                  name="email"
                  placeholder="john@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5 ml-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground" htmlFor="login_password">
                    {copy.password}
                  </label>
                  <button
                    type="button"
                    className="text-xs text-accent font-semibold hover:underline underline-offset-4"
                    onClick={() => {
                      setShowForgot(true);
                      setError(null);
                      setInfo(null);
                    }}
                  >
                    {copy.forgotPassword}
                  </button>
                </div>
                <input
                  className="w-full bg-card border-0 ring-1 ring-border/30 focus:ring-2 focus:ring-accent rounded-lg px-4 py-3.5 text-sm transition-all outline-none"
                  id="login_password"
                  name="password"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold py-4 rounded-lg transition-all duration-200 mt-4 shadow-lg shadow-accent/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                type="submit"
                disabled={submitting}
              >
                {submitting ? copy.successRedirectText : copy.loginCta}
              </button>

              <p className="text-center text-sm text-muted-foreground mt-6">
                {copy.noAccount}{" "}
                <Link
                  to="/auth"
                  className="text-accent font-bold hover:underline underline-offset-4"
                >
                  {copy.createAccountCta}
                </Link>
              </p>
            </form>
          )}

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
