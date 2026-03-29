import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Lightbulb,
  Pencil,
  Plus,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { OnboardingBottomNav } from "@/components/onboarding/OnboardingBottomNav";
import { OnboardingTopNav } from "@/components/onboarding/OnboardingTopNav";

const STEP = 6;

type TabId = "policies" | "amenities" | "location";

type CellState = { answer: string; proactive: boolean };

type CustomQuestionRow = { id: string; tab: TabId; question: string; answer: string };

type CommonQuestionsPayload = {
  cells: Record<string, CellState>;
  customQuestions: CustomQuestionRow[];
};

type ChainState = {
  profile?: unknown;
  hotelHours?: unknown;
  roomInventory?: unknown;
  bookingFinalization?: unknown;
  commonQuestions?: CommonQuestionsPayload;
};

const TAB_CONFIG: { tab: TabId; len: number }[] = [
  { tab: "policies", len: 8 },
  { tab: "amenities", len: 7 },
  { tab: "location", len: 7 },
];

function emptyBuiltinCells(): Record<string, CellState> {
  const o: Record<string, CellState> = {};
  for (const { tab, len } of TAB_CONFIG) {
    for (let i = 0; i < len; i++) {
      o[`${tab}:${i}`] = { answer: "", proactive: false };
    }
  }
  return o;
}

function mergeCells(base: Record<string, CellState>, patch: Record<string, CellState> | undefined) {
  if (!patch) return base;
  const next = { ...base };
  for (const k of Object.keys(patch)) {
    if (patch[k]) next[k] = { ...patch[k] };
  }
  return next;
}

function onlyBuiltinCells(patch: Record<string, CellState> | undefined): Record<string, CellState> {
  if (!patch) return {};
  return Object.fromEntries(Object.entries(patch).filter(([k]) => !k.startsWith("c:")));
}

function normalizeCustomQuestions(raw: unknown, legacyCells: Record<string, CellState>): CustomQuestionRow[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((entry: unknown) => {
    if (!entry || typeof entry !== "object") {
      return { id: crypto.randomUUID(), tab: "policies", question: "", answer: "" };
    }
    const o = entry as Record<string, unknown>;
    const id = typeof o.id === "string" ? o.id : crypto.randomUUID();
    const tabRaw = o.tab;
    const tab: TabId =
      tabRaw === "policies" || tabRaw === "amenities" || tabRaw === "location" ? tabRaw : "policies";
    if (typeof o.question === "string" || typeof o.answer === "string") {
      return {
        id,
        tab,
        question: typeof o.question === "string" ? o.question : "",
        answer: typeof o.answer === "string" ? o.answer : "",
      };
    }
    const title = typeof o.title === "string" ? o.title : "";
    const cell = legacyCells[`c:${id}`];
    return { id, tab, question: title, answer: cell?.answer ?? "" };
  });
}

export default function HotelOnboardingStep6Page() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const copy = useMemo(() => t.onboardingHotelCommonQuestions, [t.onboardingHotelCommonQuestions]);

  const saved = (location.state as ChainState | null)?.commonQuestions;

  const [activeTab, setActiveTab] = useState<TabId>("policies");
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [customQuestions, setCustomQuestions] = useState<CustomQuestionRow[]>(() =>
    normalizeCustomQuestions(saved?.customQuestions, saved?.cells ?? {}),
  );

  const [cells, setCells] = useState<Record<string, CellState>>(() =>
    mergeCells(emptyBuiltinCells(), onlyBuiltinCells(saved?.cells)),
  );

  const totalQuestions = 22 + customQuestions.length;
  const answeredCount = useMemo(() => {
    let n = 0;
    for (const { tab, len } of TAB_CONFIG) {
      for (let i = 0; i < len; i++) {
        if (cells[`${tab}:${i}`]?.answer.trim()) n += 1;
      }
    }
    for (const cq of customQuestions) {
      if (cq.answer.trim()) n += 1;
    }
    return n;
  }, [cells, customQuestions]);

  const circleR = 40;
  const circleLen = 2 * Math.PI * circleR;
  const dashOffset = circleLen * (1 - answeredCount / Math.max(totalQuestions, 1));

  function questionTitles(tab: TabId): string[] {
    if (tab === "policies") return copy.policiesQuestions;
    if (tab === "amenities") return copy.amenitiesQuestions;
    return copy.locationQuestions;
  }

  function builtinItemsForTab(tab: TabId): { key: string; title: string }[] {
    const titles = questionTitles(tab);
    return titles.map((title, i) => ({ key: `${tab}:${i}`, title }));
  }

  function patchCell(key: string, patch: Partial<CellState>) {
    setCells((prev) => ({
      ...prev,
      [key]: { ...(prev[key] ?? { answer: "", proactive: false }), ...patch },
    }));
  }

  function patchCustomItem(id: string, patch: Partial<Pick<CustomQuestionRow, "question" | "answer">>) {
    setCustomQuestions((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }

  function addCustomQuestion() {
    const id = crypto.randomUUID();
    setCustomQuestions((prev) => [...prev, { id, tab: activeTab, question: "", answer: "" }]);
    setExpandedKey(`custom-${id}`);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const prev = (location.state ?? null) as ChainState | null;
    const payload: CommonQuestionsPayload = {
      cells,
      customQuestions: customQuestions
        .map(({ id, tab, question, answer }) => ({
          id,
          tab,
          question: question.trim(),
          answer: answer.trim(),
        }))
        .filter((x) => x.question.length > 0),
    };
    navigate("/onboarding/hotel/step-7", {
      state: {
        profile: prev?.profile,
        hotelHours: prev?.hotelHours,
        roomInventory: prev?.roomInventory,
        bookingFinalization: prev?.bookingFinalization,
        commonQuestions: payload,
      },
    });
  }

  const tabs: { id: TabId; label: string }[] = [
    { id: "policies", label: copy.tabPolicies },
    { id: "amenities", label: copy.tabAmenities },
    { id: "location", label: copy.tabLocation },
  ];

  const customsForTab = customQuestions.filter((c) => c.tab === activeTab);

  return (
    <motion.div
      className="min-h-screen bg-background text-foreground selection:bg-accent/20"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <OnboardingTopNav step={STEP} />

      <main className="px-6 max-w-[760px] mx-auto pb-32 pt-6">
        <form id="hotel-common-questions-form" onSubmit={handleSubmit}>
          <div className="flex flex-col sm:flex-row justify-between items-start gap-8 mb-10">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-[2rem] font-bold text-foreground leading-tight tracking-tight mb-3">
                {copy.headline}
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">{copy.subhead}</p>
            </div>

            <div className="rounded-xl border border-border/40 bg-card p-5 shadow-sm ring-1 ring-border/20 w-full max-w-[220px] shrink-0 sm:mx-0 mx-auto">
              <div className="flex flex-col items-center text-center">
                <div className="relative w-20 h-20 mb-2">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 96 96" aria-hidden>
                    <circle className="text-muted/30" cx="48" cy="48" r={circleR} fill="transparent" stroke="currentColor" strokeWidth="8" />
                    <circle
                      className="text-accent transition-[stroke-dashoffset] duration-500"
                      cx="48"
                      cy="48"
                      r={circleR}
                      fill="transparent"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeDasharray={circleLen}
                      strokeDashoffset={dashOffset}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-lg font-bold tabular-nums">
                      {answeredCount}/{totalQuestions}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-semibold text-muted-foreground mb-0.5">{copy.readinessLabel}</span>
                <span className="text-xs text-muted-foreground">
                  {copy.readinessTarget.replace(/\{total\}/g, String(totalQuestions))}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 p-1 bg-muted/60 rounded-xl w-fit mb-6">
            {tabs.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === id
                    ? "bg-card text-accent shadow-sm ring-1 ring-border/30"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {builtinItemsForTab(activeTab).map(({ key, title }) => {
              const cell = cells[key] ?? { answer: "", proactive: false };
              const expanded = expandedKey === key;
              const hasAnswer = cell.answer.trim().length > 0;

              return (
                <div
                  key={key}
                  className={`rounded-xl overflow-hidden border transition-all duration-200 ${
                    expanded
                      ? "bg-card ring-2 ring-accent/25 border-accent/30"
                      : "bg-card border-border/30 hover:bg-muted/20"
                  }`}
                >
                  {expanded ? (
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-3 mb-4">
                            <h3 className="font-semibold text-lg text-foreground">{title}</h3>
                            {hasAnswer ? (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-xs font-bold text-accent">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                {copy.statusReady}
                              </span>
                            ) : null}
                          </div>
                          <textarea
                            value={cell.answer}
                            onChange={(e) => patchCell(key, { answer: e.target.value })}
                            placeholder={copy.textareaPlaceholder}
                            rows={3}
                            className="w-full rounded-lg border border-border/50 bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-accent focus:border-accent outline-none resize-none mb-4"
                          />
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <label className="flex items-center gap-3 cursor-pointer group">
                              <div className="relative flex items-center">
                                <input
                                  type="checkbox"
                                  checked={cell.proactive}
                                  onChange={(e) => patchCell(key, { proactive: e.target.checked })}
                                  className="w-5 h-5 rounded border-border text-accent focus:ring-accent"
                                />
                                <Sparkles className="absolute -right-6 h-4 w-4 text-amber-500 opacity-90 group-hover:scale-110 transition-transform pointer-events-none" />
                              </div>
                              <span className="text-sm font-medium text-foreground pl-6 sm:pl-7">{copy.proactiveLabel}</span>
                            </label>
                            <span className="text-xs text-muted-foreground italic">{copy.savedAuto}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setExpandedKey(null)}
                          className="p-2 rounded-lg text-muted-foreground hover:bg-muted shrink-0"
                          aria-label="Collapse"
                        >
                          <ChevronUp className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 min-w-0">
                        {hasAnswer ? (
                          <CheckCircle2 className="h-6 w-6 text-accent shrink-0" aria-hidden />
                        ) : (
                          <HelpCircle className="h-6 w-6 text-muted-foreground shrink-0" aria-hidden />
                        )}
                        <div className="min-w-0">
                          <h3 className="font-semibold text-foreground">{title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            {hasAnswer ? (
                              <span className="text-sm font-medium text-accent">{copy.statusReady}</span>
                            ) : (
                              <>
                                <span className="h-2 w-2 rounded-full bg-muted-foreground/50 shrink-0" />
                                <span className="text-sm text-muted-foreground">{copy.statusTransfer}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      {hasAnswer ? (
                        <button
                          type="button"
                          onClick={() => setExpandedKey(key)}
                          className="p-2 rounded-lg text-muted-foreground hover:text-accent transition-colors shrink-0"
                          aria-label="Edit"
                        >
                          <Pencil className="h-5 w-5" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setExpandedKey(key)}
                          className="flex items-center gap-2 text-accent font-semibold text-sm shrink-0 hover:gap-3 transition-all"
                        >
                          {copy.answerBtn}
                          <ChevronDown className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {customsForTab.map((item) => {
              const rowId = `custom-${item.id}`;
              const isOpen = expandedKey === rowId;
              const hasAnswer = item.answer.trim().length > 0;
              const titlePreview = item.question.trim() || copy.customQuestionPlaceholder;
              return (
                <div
                  key={item.id}
                  className={`rounded-xl overflow-hidden border transition-all duration-200 ${
                    isOpen ? "bg-card ring-2 ring-accent/25 border-accent/30" : "bg-card border-border/30 hover:bg-muted/20"
                  }`}
                >
                  {isOpen ? (
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0 space-y-4">
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="font-semibold text-lg text-foreground">{titlePreview}</h3>
                            {hasAnswer ? (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-xs font-bold text-accent">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                {copy.statusReady}
                              </span>
                            ) : null}
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
                              {copy.customQuestionLabel}
                            </label>
                            <textarea
                              value={item.question}
                              onChange={(e) => patchCustomItem(item.id, { question: e.target.value })}
                              placeholder={copy.customQuestionPlaceholder}
                              rows={2}
                              className="w-full rounded-lg border border-border/50 bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-accent focus:border-accent outline-none resize-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
                              {copy.customAnswerLabel}
                            </label>
                            <textarea
                              value={item.answer}
                              onChange={(e) => patchCustomItem(item.id, { answer: e.target.value })}
                              placeholder={copy.textareaPlaceholder}
                              rows={4}
                              className="w-full rounded-lg border border-border/50 bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-accent focus:border-accent outline-none resize-none"
                            />
                          </div>
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => setExpandedKey("")}
                              className="text-accent font-bold text-xs uppercase tracking-widest px-4 py-2 hover:bg-accent/10 rounded-lg transition-colors"
                            >
                              {copy.saveAnswer}
                            </button>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setExpandedKey("")}
                          className="p-2 rounded-lg text-muted-foreground hover:bg-muted shrink-0"
                          aria-label="Collapse"
                        >
                          <ChevronUp className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 min-w-0">
                        {hasAnswer ? (
                          <CheckCircle2 className="h-6 w-6 text-accent shrink-0" aria-hidden />
                        ) : (
                          <HelpCircle className="h-6 w-6 text-muted-foreground shrink-0" aria-hidden />
                        )}
                        <div className="min-w-0">
                          <h3 className="font-semibold text-foreground line-clamp-2">{titlePreview}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            {hasAnswer ? (
                              <span className="text-sm font-medium text-accent">{copy.statusReady}</span>
                            ) : (
                              <>
                                <span className="h-2 w-2 rounded-full bg-muted-foreground/50 shrink-0" />
                                <span className="text-sm text-muted-foreground">{copy.statusTransfer}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      {hasAnswer ? (
                        <button
                          type="button"
                          onClick={() => setExpandedKey(rowId)}
                          className="p-2 rounded-lg text-muted-foreground hover:text-accent transition-colors shrink-0"
                          aria-label="Edit"
                        >
                          <Pencil className="h-5 w-5" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setExpandedKey(rowId)}
                          className="flex items-center gap-2 text-accent font-semibold text-sm shrink-0 hover:gap-3 transition-all"
                        >
                          {copy.answerBtn}
                          <ChevronDown className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  )}
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
          </div>

          <div className="flex gap-3 p-4 rounded-xl bg-card ring-1 ring-border/30 overflow-hidden relative mt-10">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent" />
            <Lightbulb className="h-4 w-4 text-accent mt-0.5 ml-2 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-accent mb-1">{copy.proTipBadge}</p>
              <p className="text-sm font-medium text-foreground">{copy.proTipTitle}</p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{copy.proTipBody}</p>
            </div>
          </div>
        </form>
      </main>

      <OnboardingBottomNav
        backLabel={copy.back}
        continueLabel={copy.continue}
        onBack={() => navigate("/onboarding/hotel/step-5", { state: location.state })}
        formId="hotel-common-questions-form"
      />
    </motion.div>
  );
}
