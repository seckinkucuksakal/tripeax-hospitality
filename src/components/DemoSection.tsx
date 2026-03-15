import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

const DemoSection = () => {
  const [submitted, setSubmitted] = useState(false);
  const { t } = useLanguage();

  return (
    <section id="demo" className="py-24">
      <div className="container max-w-[480px] text-center">
        <h2 className="font-serif text-display text-foreground mb-3">
          {t.demo.headline}
        </h2>
        <p className="text-base text-muted-foreground mb-10">
          {t.demo.subhead}
        </p>

        {submitted ? (
          <div className="border border-accent rounded-2xl p-10 bg-accent/5 shadow-sm">
            <p className="text-lg font-semibold text-foreground mb-2">{t.demo.thanks}</p>
            <p className="text-sm text-muted-foreground">{t.demo.thanksDesc}</p>
          </div>
        ) : (
          <form
            onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
            className="border border-border rounded-2xl p-9 bg-card shadow-sm text-left space-y-4"
          >
            <div>
              <label className="block text-[13px] font-semibold text-foreground mb-1.5">{t.demo.name}</label>
              <input
                required
                type="text"
                placeholder={t.demo.namePlaceholder}
                className="w-full rounded-lg border border-border bg-background px-3.5 py-3 text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-foreground mb-1.5">{t.demo.phone}</label>
              <input
                required
                type="tel"
                placeholder={t.demo.phonePlaceholder}
                className="w-full rounded-lg border border-border bg-background px-3.5 py-3 text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-foreground mb-1.5">{t.demo.industry}</label>
              <select className="w-full rounded-lg border border-border bg-background px-3.5 py-3 text-[15px] text-foreground focus:outline-none">
                {t.demo.industries.map((ind) => (
                  <option key={ind}>{ind}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-accent text-accent-foreground py-4 rounded-lg text-base font-bold hover:bg-accent/90 transition-all shadow-lg shadow-accent/20 flex items-center justify-center gap-2 mt-2"
            >
              {t.demo.cta} <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default DemoSection;
