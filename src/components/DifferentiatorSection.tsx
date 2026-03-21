import { motion } from "framer-motion";
import { X, Check } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

const DifferentiatorSection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-background">
      <div className="container max-w-[1000px]">
        <div className="text-center mb-14">
          <span className="text-[13px] font-semibold tracking-[0.1em] uppercase text-accent">
            {t.diff.eyebrow}
          </span>
          <h2 className="font-serif text-display text-foreground mt-4">
            {t.diff.headline}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Without */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
            className="rounded-2xl border border-coral/20 bg-coral/[0.04] p-8"
          >
            <p className="text-[15px] font-bold text-coral mb-6 uppercase tracking-wide">
              {t.diff.without.label}
            </p>
            <ul className="space-y-4">
              {t.diff.without.items.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <X className="h-4 w-4 text-coral shrink-0 mt-0.5" />
                  <span className="text-[15px] text-foreground/80 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* With */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
            className="rounded-2xl border-2 border-accent/30 bg-accent/[0.04] p-8"
          >
            <p className="text-[15px] font-bold text-accent mb-6 uppercase tracking-wide">
              {t.diff.with.label}
            </p>
            <ul className="space-y-4">
              {t.diff.with.items.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                  <span className="text-[15px] text-foreground/80 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DifferentiatorSection;
