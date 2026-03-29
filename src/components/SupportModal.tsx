import { useLanguage } from "@/lib/LanguageContext";
import { useSupportModal } from "@/lib/SupportModalContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export const SUPPORT_EMAIL = "business@tripeax.com";

export function SupportModal() {
  const { t } = useLanguage();
  const m = t.supportModal;
  const { isOpen, variant, closeSupport } = useSupportModal();

  const block = m[variant];

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SUPPORT_EMAIL);
      toast.success(m.copiedToast);
    } catch {
      toast.error(m.copyFailedToast);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeSupport()}>
      <DialogContent className="max-w-md border-slate-200 sm:rounded-xl dark:border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-dash-ink dark:text-white">{block.title}</DialogTitle>
          <DialogDescription className="text-left text-base text-slate-600 dark:text-slate-300">
            {block.description}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center pt-1">
          <div className="inline-flex items-center gap-1">
            <code className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-emerald-800 dark:bg-slate-800 dark:text-emerald-300">
              {SUPPORT_EMAIL}
            </code>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-10 w-10 shrink-0 text-slate-600 hover:text-emerald-700 dark:text-slate-400 dark:hover:text-emerald-400"
              aria-label={m.copyEmail}
              onClick={() => void copyEmail()}
            >
              <span className="material-symbols-outlined text-[22px]">content_copy</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
