import { Check } from "lucide-react";

type Props = {
  selected: boolean;
  /** Non-selectable row (e.g. coming soon). */
  disabled?: boolean;
};

export function SystemSelectIndicator({ selected, disabled }: Props) {
  if (disabled) {
    return (
      <span
        className="w-6 h-6 rounded-full border-2 border-muted-foreground/25 bg-muted/40 shrink-0"
        aria-hidden
      />
    );
  }
  if (selected) {
    return (
      <span
        className="w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center shrink-0"
        aria-hidden
      >
        <Check className="h-4 w-4" />
      </span>
    );
  }
  return (
    <span className="w-6 h-6 rounded-full border-2 border-border/55 bg-background shrink-0" aria-hidden />
  );
}
