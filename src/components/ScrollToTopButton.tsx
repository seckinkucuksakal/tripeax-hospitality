import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

const SHOW_AFTER_PX = 180;

/** Slow start & end — feels smoother than native `behavior: smooth` on many setups. */
function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > SHOW_AFTER_PX);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(
    () => () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    },
    []
  );

  const scrollUp = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    const startY = window.scrollY;
    if (startY <= 0) return;

    const duration = Math.min(1400, Math.max(700, startY * 0.5));
    const t0 = performance.now();

    const step = (now: number) => {
      const elapsed = now - t0;
      const t = Math.min(elapsed / duration, 1);
      const eased = easeInOutCubic(t);
      window.scrollTo(0, Math.round(startY * (1 - eased)));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(step);
  }, []);

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={scrollUp}
      className={cn(
        "fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full",
        "bg-accent text-accent-foreground shadow-lg shadow-accent/25",
        "transition-all duration-300 ease-out",
        "hover:bg-accent/90 hover:shadow-xl hover:shadow-accent/30 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-2 opacity-0"
      )}
    >
      <ArrowUp className="h-5 w-5" strokeWidth={2.5} aria-hidden />
    </button>
  );
}
