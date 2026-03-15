import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Check, ArrowRight } from "lucide-react";
import { useBookDemoModal } from "@/lib/BookDemoModalContext";
import { useLanguage } from "@/lib/LanguageContext";
import { cn } from "@/lib/utils";

export function BookDemoModal() {
  const { isOpen, closeBookDemo } = useBookDemoModal();
  const { t } = useLanguage();
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const m = t.bookDemoModal;

  const toggleOption = (i: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && closeBookDemo()}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        />
        <Dialog.Content
          className={cn(
            "fixed left-[50%] top-[50%] z-50 w-[95vw] max-w-[880px] translate-x-[-50%] translate-y-[-50%]",
            "rounded-2xl border-0 bg-white p-0 shadow-xl",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "focus:outline-none"
          )}
          onPointerDownOutside={closeBookDemo}
          onEscapeKeyDown={closeBookDemo}
        >
          <div className="flex flex-col md:flex-row min-h-[420px]">
            {/* Left: branding + copy */}
            <div className="flex flex-col justify-center p-8 md:p-10 md:pr-6 md:min-w-[320px] md:border-r border-border/60">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                  <span className="text-accent-foreground font-serif font-bold text-base">T</span>
                </div>
                <span className="font-serif text-[18px] font-semibold text-accent">Tripeax</span>
              </div>
              <h2 className="text-[22px] md:text-[24px] font-bold text-foreground leading-tight">
                {m.title}
              </h2>
              <div className="w-12 h-0.5 bg-accent rounded-full my-4" />
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                {m.description}
              </p>
              <ul className="space-y-2.5">
                {m.bullets.map((text, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 shrink-0 text-accent" strokeWidth={2.5} />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: form step */}
            <div className="flex flex-col p-8 md:p-10 md:pl-8 flex-1 relative">
              <Dialog.Close
                className="absolute right-6 top-6 rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </Dialog.Close>

              <div className="mb-2">
                <span className="text-sm font-medium text-muted-foreground">{m.stepLabel}</span>
              </div>
              <div className="h-0.5 w-full bg-muted rounded-full mb-6 overflow-hidden">
                <div className="h-full w-1/5 bg-accent rounded-full" />
              </div>

              <h3 className="text-base font-semibold text-foreground mb-1">{m.sectionTitle}</h3>
              <p className="text-sm text-muted-foreground mb-4">{m.selectHint}</p>

              <div className="grid grid-cols-2 gap-2 mb-6">
                {m.options.map((label, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => toggleOption(i)}
                    className={cn(
                      "rounded-full px-4 py-2.5 text-sm font-medium transition-colors border",
                      selected.has(i)
                        ? "bg-accent/10 border-accent text-accent"
                        : "bg-muted/40 border-border text-muted-foreground hover:border-muted-foreground/40 hover:text-foreground"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="mt-auto flex justify-end">
                <button
                  type="button"
                  onClick={() => {}}
                  className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground hover:bg-accent/90 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  {m.continueBtn} <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
