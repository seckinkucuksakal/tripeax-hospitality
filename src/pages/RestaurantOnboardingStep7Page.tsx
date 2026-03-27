import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, Circle, CircleCheckBig, Plus } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { OnboardingBottomNav } from "@/components/onboarding/OnboardingBottomNav";
import { OnboardingTopNav } from "@/components/onboarding/OnboardingTopNav";

const STEP = 7;

type ChainState = {
  profile?: unknown;
  operatingHours?: unknown;
  menu?: unknown;
  reservationSettings?: unknown;
  reservationIntegration?: unknown;
  callerFaqs?: {
    answers?: Record<string, string>;
    customQuestions?: string[];
  };
  aiVoicePersona?: unknown;
};

type QuestionItem = {
  id: string;
  question: string;
};

export default function RestaurantOnboardingStep7Page() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const copy = useMemo(() => t.onboardingRestaurantFaq, [t.onboardingRestaurantFaq]);

  const questions = useMemo<QuestionItem[]>(
    () => copy.questions.map((q, i) => ({ id: `q-${i + 1}`, question: q })),
    [copy.questions],
  );

  const initialFaqs = (location.state as ChainState | null)?.callerFaqs;
  const [answers, setAnswers] = useState<Record<string, string>>(() => initialFaqs?.answers ?? {});
  const [openQuestionId, setOpenQuestionId] = useState<string>(questions[0]?.id ?? "");
  const [customQuestions, setCustomQuestions] = useState<string[]>(() => initialFaqs?.customQuestions ?? []);

  const answeredCount = useMemo(
    () => questions.filter((q) => (answers[q.id] ?? "").trim().length > 0).length,
    [answers, questions],
  );

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const prev = (location.state ?? null) as ChainState | null;
    navigate("/onboarding/restaurant/step-8", {
      state: {
        profile: prev?.profile,
        operatingHours: prev?.operatingHours,
        menu: prev?.menu,
        reservationSettings: prev?.reservationSettings,
        reservationIntegration: prev?.reservationIntegration,
        aiVoicePersona: prev?.aiVoicePersona,
        callerFaqs: {
          answers: Object.fromEntries(
            Object.entries(answers)
              .map(([k, v]) => [k, v.trim()] as const)
              .filter(([, v]) => v.length > 0),
          ),
          customQuestions: customQuestions.map((q) => q.trim()).filter(Boolean),
        },
      },
    });
  }

  function addCustomQuestion() {
    setCustomQuestions((prev) => [...prev, ""]);
  }

  return (
    <motion.div
      className="min-h-screen bg-background text-foreground selection:bg-accent/20"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <OnboardingTopNav step={STEP} />

      <main className="px-4 max-w-[640px] mx-auto pb-32 pt-6">
        <section className="mb-8">
          <div className="flex justify-between items-end mb-4 gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold tracking-tight leading-tight">{copy.headline}</h1>
              <p className="text-sm text-muted-foreground mt-2">{copy.subhead}</p>
            </div>
            <div className="text-right shrink-0">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold tracking-wider whitespace-nowrap">
                {copy.answeredLabel
                  .replace("{answered}", String(answeredCount))
                  .replace("{total}", String(questions.length))}
              </span>
            </div>
          </div>
        </section>

        <form id="restaurant-faq-form" className="space-y-4" onSubmit={handleSubmit}>
          {questions.map((item) => {
            const isOpen = openQuestionId === item.id;
            const hasAnswer = (answers[item.id] ?? "").trim().length > 0;
            return (
              <div
                key={item.id}
                className={`rounded-xl shadow-sm overflow-hidden transition-all ${
                  isOpen ? "border-2 border-accent bg-card" : "border border-border/40 bg-card hover:border-border/70"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenQuestionId(isOpen ? "" : item.id)}
                  className="w-full flex items-center p-4 text-left"
                >
                  <div className="mr-4 shrink-0 text-muted-foreground">
                    {hasAnswer ? <CircleCheckBig className="h-5 w-5 text-accent" /> : <Circle className="h-5 w-5" />}
                  </div>
                  <h3 className="font-bold text-sm flex-1">{item.question}</h3>
                  <span className="ml-2 shrink-0 text-muted-foreground">
                    {isOpen ? <ChevronUp className="h-5 w-5 text-accent" /> : <ChevronDown className="h-5 w-5" />}
                  </span>
                </button>
                {isOpen ? (
                  <div className="px-4 pb-4 bg-card">
                    <textarea
                      value={answers[item.id] ?? ""}
                      onChange={(e) => setAnswers((prev) => ({ ...prev, [item.id]: e.target.value }))}
                      placeholder={copy.answerPlaceholder}
                      rows={4}
                      className="w-full bg-muted/40 border border-accent/30 focus:border-accent focus:ring-0 rounded-xl text-sm p-4 resize-none"
                    />
                    <div className="mt-3 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setOpenQuestionId("")}
                        className="text-accent font-bold text-xs uppercase tracking-widest px-4 py-2 hover:bg-accent/10 rounded-lg transition-colors"
                      >
                        {copy.saveAnswer}
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}

          {customQuestions.map((question, idx) => (
            <input
              key={`custom-${idx}`}
              value={question}
              onChange={(e) =>
                setCustomQuestions((prev) => prev.map((v, i) => (i === idx ? e.target.value : v)))
              }
              placeholder={copy.customQuestionPlaceholder}
              className="w-full border border-border/50 bg-card rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent focus:outline-none"
            />
          ))}

          <button
            type="button"
            onClick={addCustomQuestion}
            className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-accent/40 rounded-xl text-accent font-bold text-sm hover:bg-accent/5 transition-colors mt-2"
          >
            <Plus className="h-4 w-4" />
            {copy.addCustomQuestion}
          </button>
        </form>
      </main>

      <OnboardingBottomNav
        backLabel={copy.back}
        continueLabel={copy.continue}
        onBack={() => navigate("/onboarding/restaurant/step-6", { state: location.state })}
        formId="restaurant-faq-form"
      />
    </motion.div>
  );
}
