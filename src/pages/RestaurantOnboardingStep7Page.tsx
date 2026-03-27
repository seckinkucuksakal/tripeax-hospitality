import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, Circle, CircleCheckBig, Plus } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { OnboardingBottomNav } from "@/components/onboarding/OnboardingBottomNav";
import { OnboardingTopNav } from "@/components/onboarding/OnboardingTopNav";

const STEP = 7;

type CustomFaqItem = {
  id: string;
  question: string;
  answer: string;
};

type ChainState = {
  profile?: unknown;
  operatingHours?: unknown;
  menu?: unknown;
  reservationSettings?: unknown;
  reservationIntegration?: unknown;
  callerFaqs?: {
    answers?: Record<string, string>;
    customQuestions?: Array<string | { question: string; answer?: string; id?: string }>;
  };
  aiVoicePersona?: unknown;
};

type QuestionItem = {
  id: string;
  question: string;
};

function normalizeCustomQuestions(raw: unknown): CustomFaqItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((entry) => {
    if (typeof entry === "string") {
      return { id: crypto.randomUUID(), question: entry, answer: "" };
    }
    if (entry && typeof entry === "object") {
      const o = entry as { id?: string; question?: unknown; answer?: unknown };
      return {
        id: typeof o.id === "string" ? o.id : crypto.randomUUID(),
        question: typeof o.question === "string" ? o.question : "",
        answer: typeof o.answer === "string" ? o.answer : "",
      };
    }
    return { id: crypto.randomUUID(), question: "", answer: "" };
  });
}

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
  const [customItems, setCustomItems] = useState<CustomFaqItem[]>(() =>
    normalizeCustomQuestions(initialFaqs?.customQuestions),
  );

  const totalQuestionCount = questions.length + customItems.length;

  const answeredCount = useMemo(() => {
    const preset = questions.filter((q) => (answers[q.id] ?? "").trim().length > 0).length;
    const custom = customItems.filter((c) => (c.answer ?? "").trim().length > 0).length;
    return preset + custom;
  }, [answers, questions, customItems]);

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
          customQuestions: customItems
            .map(({ id, question, answer }) => ({
              id,
              question: question.trim(),
              answer: answer.trim(),
            }))
            .filter((x) => x.question.length > 0),
        },
      },
    });
  }

  function addCustomQuestion() {
    setCustomItems((prev) => [...prev, { id: crypto.randomUUID(), question: "", answer: "" }]);
  }

  function patchCustomItem(id: string, patch: Partial<Pick<CustomFaqItem, "question" | "answer">>) {
    setCustomItems((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
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
                  .replace("{total}", String(totalQuestionCount))}
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

          {customItems.map((item) => {
            const rowId = `custom-${item.id}`;
            const isOpen = openQuestionId === rowId;
            const hasAnswer = (item.answer ?? "").trim().length > 0;
            const titlePreview = item.question.trim() || copy.customQuestionPlaceholder;
            return (
              <div
                key={item.id}
                className={`rounded-xl shadow-sm overflow-hidden transition-all ${
                  isOpen ? "border-2 border-accent bg-card" : "border border-border/40 bg-card hover:border-border/70"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenQuestionId(isOpen ? "" : rowId)}
                  className="w-full flex items-center p-4 text-left"
                >
                  <div className="mr-4 shrink-0 text-muted-foreground">
                    {hasAnswer ? <CircleCheckBig className="h-5 w-5 text-accent" /> : <Circle className="h-5 w-5" />}
                  </div>
                  <h3 className="font-bold text-sm flex-1 line-clamp-2">{titlePreview}</h3>
                  <span className="ml-2 shrink-0 text-muted-foreground">
                    {isOpen ? <ChevronUp className="h-5 w-5 text-accent" /> : <ChevronDown className="h-5 w-5" />}
                  </span>
                </button>
                {isOpen ? (
                  <div className="px-4 pb-4 bg-card space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
                        {copy.customQuestionLabel}
                      </label>
                      <textarea
                        value={item.question}
                        onChange={(e) => patchCustomItem(item.id, { question: e.target.value })}
                        placeholder={copy.customQuestionPlaceholder}
                        rows={2}
                        className="w-full bg-muted/40 border border-border/50 focus:border-accent focus:ring-0 rounded-xl text-sm p-3 resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
                        {copy.customAnswerLabel}
                      </label>
                      <textarea
                        value={item.answer}
                        onChange={(e) => patchCustomItem(item.id, { answer: e.target.value })}
                        placeholder={copy.answerPlaceholder}
                        rows={4}
                        className="w-full bg-muted/40 border border-accent/30 focus:border-accent focus:ring-0 rounded-xl text-sm p-4 resize-none"
                      />
                    </div>
                    <div className="flex justify-end pt-1">
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
