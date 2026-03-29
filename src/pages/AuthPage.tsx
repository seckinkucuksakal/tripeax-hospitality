import type { FormEvent, MouseEvent } from "react";
import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLanguage } from "@/lib/LanguageContext";
import { DEMO_PAYMENT_COMPLETE_KEY } from "@/lib/demo-payment";

type Mode = "register" | "login";

type UserRecord = {
  email: string;
  fullName: string;
  phone?: string;
  whatsapp?: string;
  createdAt: number;
};

const USERS_KEY = "tripeax_demo_users_v1";
const SESSION_KEY = "tripeax_demo_session_v1";

function readUsers(): Record<string, UserRecord> {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, UserRecord>;
  } catch {
    return {};
  }
}

function writeUsers(users: Record<string, UserRecord>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function setSession(email: string) {
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      email,
      createdAt: Date.now(),
    }),
  );
}

export default function AuthPage() {
  const { t, lang, setLang } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialMode: Mode = (searchParams.get("mode") as Mode | null) === "login" ? "login" : "register";
  const [mode, setMode] = useState<Mode>(initialMode);

  const demoPassword = "123";

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [registerForm, setRegisterForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    whatsapp: "",
    sameNumber: false,
    password: demoPassword,
    confirmPassword: demoPassword,
  });

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: demoPassword,
  });

  const copy = useMemo(() => t.auth, [t.auth]);

  function resetFormForMode(nextMode: Mode) {
    setError(null);
    setSubmitting(false);
    setMode(nextMode);
  }

  /** Dev only: double-click the Create account button to skip validation and go to onboarding. */
  function handleRegisterDevBypass(e: MouseEvent<HTMLButtonElement>) {
    if (!import.meta.env.DEV || mode !== "register") return;
    e.preventDefault();
    e.stopPropagation();
    setError(null);
    const email = registerForm.email.trim() || "dev-bypass@local.local";
    const users = readUsers();
    users[email] = {
      email,
      fullName: registerForm.fullName.trim() || email.split("@")[0],
      phone: registerForm.phone.trim() || undefined,
      whatsapp: registerForm.sameNumber
        ? registerForm.phone.trim() || undefined
        : registerForm.whatsapp.trim() || undefined,
      createdAt: Date.now(),
    };
    writeUsers(users);
    setSession(email);
    try {
      localStorage.removeItem(DEMO_PAYMENT_COMPLETE_KEY);
    } catch {
      /* ignore */
    }
    navigate("/payment");
  }

  async function handleRegister(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const email = registerForm.email.trim();
      if (!email) {
        setError(copy.validationEmailRequired);
        return;
      }

      if (registerForm.password !== demoPassword) {
        setError(copy.validationPasswordMustBe123);
        return;
      }

      if (registerForm.confirmPassword !== demoPassword || registerForm.confirmPassword !== registerForm.password) {
        setError(copy.validationConfirmPasswordMismatch);
        return;
      }

      const users = readUsers();
      users[email] = {
        email,
        fullName: registerForm.fullName.trim() || email.split("@")[0],
        phone: registerForm.phone.trim() || undefined,
        whatsapp: registerForm.sameNumber ? (registerForm.phone.trim() || undefined) : registerForm.whatsapp.trim() || undefined,
        createdAt: Date.now(),
      };
      writeUsers(users);
      setSession(email);
      try {
        localStorage.removeItem(DEMO_PAYMENT_COMPLETE_KEY);
      } catch {
        /* ignore */
      }

      // Register successful -> dummy payment, then onboarding.
      navigate("/payment");
    } catch {
      setError(copy.submitErrorGeneric);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const email = loginForm.email.trim();
      if (!email) {
        setError(copy.validationEmailRequired);
        return;
      }

      if (loginForm.password !== demoPassword) {
        setError(copy.validationPasswordMustBe123);
        return;
      }

      const users = readUsers();
      if (!users[email]) {
        // Dummy behavior: login can work even if the user didn't register before.
        users[email] = {
          email,
          fullName: email.split("@")[0],
          createdAt: Date.now(),
        };
        writeUsers(users);
      }

      setSession(email);
      navigate("/home");
    } catch {
      setError(copy.submitErrorGeneric);
    } finally {
      setSubmitting(false);
    }
  }

  const primaryCta = mode === "register" ? copy.createAccountCta : copy.loginCta;

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
        {/* Language Toggle Top Right */}
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
              {mode === "register" ? copy.registerTitle : copy.loginTitle}
            </h2>
          </div>

          {error ? (
            <div className="mb-5 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive font-semibold">
              {error}
            </div>
          ) : null}

          <form className="space-y-5" onSubmit={mode === "register" ? handleRegister : handleLogin}>
            {mode === "register" ? (
              <>
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 ml-1" htmlFor="full_name">
                    {copy.fullName}
                  </label>
                  <input
                    className="w-full bg-card border-0 ring-1 ring-border/30 focus:ring-2 focus:ring-accent rounded-lg px-4 py-3.5 text-sm transition-all outline-none"
                    id="full_name"
                    name="full_name"
                    placeholder="John Doe"
                    type="text"
                    value={registerForm.fullName}
                    onChange={(e) => setRegisterForm((s) => ({ ...s, fullName: e.target.value }))}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 ml-1" htmlFor="email">
                    {copy.emailAddress}
                  </label>
                  <input
                    className="w-full bg-card border-0 ring-1 ring-border/30 focus:ring-2 focus:ring-accent rounded-lg px-4 py-3.5 text-sm transition-all outline-none"
                    id="email"
                    name="email"
                    placeholder="john@example.com"
                    type="email"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm((s) => ({ ...s, email: e.target.value }))}
                  />
                </div>

                {/* Phone Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 ml-1" htmlFor="phone">
                      {copy.phoneNumber}
                    </label>
                    <input
                      className="w-full bg-card border-0 ring-1 ring-border/30 focus:ring-2 focus:ring-accent rounded-lg px-4 py-3.5 text-sm transition-all outline-none"
                      id="phone"
                      name="phone"
                      placeholder="+1 (555) 000-0000"
                      type="tel"
                      value={registerForm.phone}
                      onChange={(e) => {
                        const phone = e.target.value;
                        setRegisterForm((s) => ({
                          ...s,
                          phone,
                          whatsapp: s.sameNumber ? phone : s.whatsapp,
                        }));
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 ml-1" htmlFor="whatsapp">
                      {copy.whatsappNumber}
                    </label>
                    <input
                      className="w-full bg-card border-0 ring-1 ring-border/30 focus:ring-2 focus:ring-accent rounded-lg px-4 py-3.5 text-sm transition-all outline-none"
                      id="whatsapp"
                      name="whatsapp"
                      placeholder="+1 (555) 000-0000"
                      type="tel"
                      value={registerForm.whatsapp}
                      disabled={registerForm.sameNumber}
                      onChange={(e) => setRegisterForm((s) => ({ ...s, whatsapp: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Checkbox */}
                <div className="flex items-center gap-3 px-1">
                  <div className="relative flex items-center">
                    <input
                      className="w-4 h-4 text-accent bg-card border-border rounded focus:ring-accent/20"
                      id="same_number"
                      type="checkbox"
                      checked={registerForm.sameNumber}
                      onChange={(e) =>
                        setRegisterForm((s) => ({
                          ...s,
                          sameNumber: e.target.checked,
                          whatsapp: e.target.checked ? s.phone : s.whatsapp,
                        }))
                      }
                    />
                  </div>
                  <label className="text-sm text-muted-foreground font-medium cursor-pointer" htmlFor="same_number">
                    {copy.whatsappSameAsPhone}
                  </label>
                </div>

                {/* Password Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 ml-1" htmlFor="password">
                      {copy.password}
                    </label>
                    <input
                      className="w-full bg-card border-0 ring-1 ring-border/30 focus:ring-2 focus:ring-accent rounded-lg px-4 py-3.5 text-sm transition-all outline-none"
                      id="password"
                      name="password"
                      placeholder="••••••••"
                      type="password"
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm((s) => ({ ...s, password: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 ml-1" htmlFor="confirm_password">
                      {copy.confirmPassword}
                    </label>
                    <input
                      className="w-full bg-card border-0 ring-1 ring-border/30 focus:ring-2 focus:ring-accent rounded-lg px-4 py-3.5 text-sm transition-all outline-none"
                      id="confirm_password"
                      name="confirm_password"
                      placeholder="••••••••"
                      type="password"
                      value={registerForm.confirmPassword}
                      onChange={(e) => setRegisterForm((s) => ({ ...s, confirmPassword: e.target.value }))}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Email */}
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
                    value={loginForm.email}
                    onChange={(e) => setLoginForm((s) => ({ ...s, email: e.target.value }))}
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 ml-1" htmlFor="login_password">
                    {copy.password}
                  </label>
                  <input
                    className="w-full bg-card border-0 ring-1 ring-border/30 focus:ring-2 focus:ring-accent rounded-lg px-4 py-3.5 text-sm transition-all outline-none"
                    id="login_password"
                    name="password"
                    placeholder="••••••••"
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm((s) => ({ ...s, password: e.target.value }))}
                  />
                </div>
              </>
            )}

            <button
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold py-4 rounded-lg transition-all duration-200 mt-4 shadow-lg shadow-accent/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              type="submit"
              disabled={submitting}
              onDoubleClick={mode === "register" && import.meta.env.DEV ? handleRegisterDevBypass : undefined}
            >
              {submitting ? copy.successRedirectText : primaryCta}
            </button>

            {/* Login Link / Register Link */}
            <p className="text-center text-sm text-muted-foreground mt-6">
              {mode === "register" ? (
                <>
                  {copy.alreadyHaveAccount}{" "}
                  <button
                    type="button"
                    className="text-accent font-bold hover:underline underline-offset-4"
                    onClick={() => resetFormForMode("login")}
                  >
                    {copy.logInLink}
                  </button>
                </>
              ) : (
                <>
                  {copy.noAccount}{" "}
                  <button
                    type="button"
                    className="text-accent font-bold hover:underline underline-offset-4"
                    onClick={() => resetFormForMode("register")}
                  >
                    {copy.createAccountCta}
                  </button>
                </>
              )}
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

