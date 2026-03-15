import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { useBookDemoModal } from "@/lib/BookDemoModalContext";
import { useLanguage } from "@/lib/LanguageContext";

const HeroSection = () => {
  const { t } = useLanguage();
  const { openBookDemo } = useBookDemoModal();
  const [sampleModalOpen, setSampleModalOpen] = useState(false);

  return (
    <section className="pt-36 pb-20 md:pt-44 md:pb-28 bg-background relative overflow-hidden">
      <div className="container relative">
        <div className="text-center max-w-[800px] mx-auto">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
            className="inline-flex items-center gap-2 bg-green-light px-4 py-1.5 rounded-full mb-8"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span className="text-[13px] text-accent font-semibold tracking-[0.04em] uppercase">
              {t.hero.eyebrow}
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease: [0.16, 1, 0.3, 1] as const }}
            className="text-hero font-serif text-foreground"
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
            className="text-[19px] leading-relaxed text-muted-foreground max-w-[620px] mx-auto mt-6 mb-10"
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
              onClick={openBookDemo}
              className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2 px-9 py-6 text-base font-semibold shadow-lg shadow-accent/20 hover:-translate-y-0.5 transition-all"
            >
              {t.hero.cta1} <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-border text-foreground hover:border-foreground gap-2 px-9 py-6 text-base"
              onClick={() => setSampleModalOpen(true)}
            >
              🎧 {t.hero.cta2}
            </Button>
          </motion.div>

          {/* Sample call modal */}
          <Dialog open={sampleModalOpen} onOpenChange={setSampleModalOpen}>
            <DialogContent className="max-w-md rounded-2xl border-0 bg-white p-8 shadow-xl focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
              <DialogTitle className="sr-only">
                {t.hero.cta2}
              </DialogTitle>
              <p className="pr-6 text-center text-base leading-relaxed text-foreground">
                {t.hero.sampleModalMessage}
              </p>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] as const }}
          className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden max-w-[900px] mx-auto mt-16 shadow-sm"
        >
          {t.hero.stats.map((stat, i) => (
            <div key={i} className="bg-card p-7 text-center">
              <p className={`font-serif text-[32px] mb-1.5 ${stat.urgent ? "text-coral" : "text-accent"}`}>
                {stat.num}
              </p>
              <p className="text-[13px] text-muted-foreground leading-snug">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
