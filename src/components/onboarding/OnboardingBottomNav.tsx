type Props = {
  backLabel: string;
  continueLabel: string;
  onBack: () => void;
  /** When set, Continue uses `type="submit"` for this form id. */
  formId?: string;
  continueDisabled?: boolean;
};

/**
 * Fixed bottom navigation — same layout for restaurant & hotel profile steps.
 */
export function OnboardingBottomNav({ backLabel, continueLabel, onBack, formId, continueDisabled }: Props) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/40 bg-background/95 backdrop-blur-md px-6 py-4 shadow-[0_-4px_24px_rgba(20,27,43,0.06)]">
      <div className="max-w-[760px] mx-auto flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2.5 text-sm font-bold text-muted-foreground hover:text-accent transition-colors rounded-lg hover:bg-muted/50 active:scale-[0.98]"
        >
          {backLabel}
        </button>
        <button
          type={formId ? "submit" : "button"}
          form={formId}
          disabled={continueDisabled}
          className="px-12 py-4 bg-accent text-accent-foreground font-bold rounded-lg hover:bg-accent/90 transition-all duration-300 active:scale-[0.98] shadow-lg shadow-accent/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {continueLabel}
        </button>
      </div>
    </nav>
  );
}
