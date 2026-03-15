import { useLanguage } from "@/lib/LanguageContext";

const IntegrationsBar = () => {
  const { t } = useLanguage();

  return (
    <section className="py-14 border-y border-border bg-secondary">
      <div className="container max-w-[1000px] text-center">
        <span className="text-[13px] tracking-[0.12em] uppercase text-accent font-semibold">
          {t.integrations.eyebrow}
        </span>
        <div className="flex flex-wrap justify-center gap-8 mt-6 items-center">
          {t.integrations.names.map((name) => (
            <span key={name} className="text-[15px] font-semibold text-foreground/40">
              {name}
            </span>
          ))}
        </div>
        <p className="text-[13px] text-muted-foreground/50 mt-4">{t.integrations.footnote}</p>
      </div>
    </section>
  );
};

export default IntegrationsBar;
