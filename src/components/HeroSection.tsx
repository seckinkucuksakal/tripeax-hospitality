import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/LanguageContext";
import { useBookDemoModal } from "@/lib/BookDemoModalContext";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const { t } = useLanguage();
  const { openBookDemo } = useBookDemoModal();
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[100dvh] flex flex-col bg-background overflow-hidden pt-[84px]">
      {/* Full viewport; pt matches fixed navbar (h-[84px]); content vertically centered */}
      <div className="container relative flex flex-1 flex-col justify-center py-10 md:py-14">
        <div className="text-center max-w-[min(96vw,1100px)] mx-auto px-2 sm:px-0">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
            className="inline-flex items-center gap-2 bg-green-light px-5 py-2 rounded-full mb-8 md:mb-10"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span className="text-sm md:text-[15px] text-accent font-semibold tracking-[0.04em] uppercase">
              {t.hero.eyebrow}
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease: [0.16, 1, 0.3, 1] as const }}
            className="text-hero font-serif text-foreground px-1"
          >
            {t.hero.headline1}
            <br />
            <span className="text-accent">{t.hero.headline2}</span>
          </motion.h1>

          {/* Subhead */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] as const }}
            className="text-lg sm:text-xl md:text-2xl leading-relaxed md:leading-relaxed text-muted-foreground max-w-[min(92vw,760px)] mx-auto mt-8 md:mt-10 mb-10 md:mb-12"
          >
            {t.hero.subhead}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] as const }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              size="lg"
                onClick={() => navigate("/auth?mode=register")}
              className="ring-1 ring-accent/35 ring-offset-background ring-offset-2 bg-accent/12 text-accent hover:bg-accent/16 gap-2 px-10 py-7 text-lg font-semibold shadow-sm hover:-translate-y-0.5 transition-all"
            >
              {t.hero.cta2} <ArrowRight className="h-5 w-5" />
            </Button>
            <Button
              size="lg"
              onClick={openBookDemo}
              className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2 px-10 py-7 text-lg font-semibold shadow-lg shadow-accent/20 hover:-translate-y-0.5 transition-all"
            >
              {t.hero.cta1} <ArrowRight className="h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
