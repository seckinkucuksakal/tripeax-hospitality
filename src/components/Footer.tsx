import { useLanguage } from "@/lib/LanguageContext";
import { useBookDemoModal } from "@/lib/BookDemoModalContext";

const Footer = () => {
  const { t } = useLanguage();
  const { openBookDemo } = useBookDemoModal();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-foreground pt-16 pb-10 px-6 md:px-10">
      <div className="container">
        <div className="text-center mb-14 pb-14 border-b border-primary-foreground/10">
          <h2 className="font-serif text-display text-primary-foreground">
            {t.footer.headline1}
            <br />
            <span className="text-accent">{t.footer.headline2}</span>
          </h2>
          <p className="text-[15px] text-primary-foreground/50 mt-3 mb-8">
            {t.footer.subtext}
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button
              onClick={openBookDemo}
              className="bg-accent text-accent-foreground px-8 py-3.5 rounded-lg text-[15px] font-bold hover:bg-accent/80 transition-all"
            >
              {t.footer.cta1} →
            </button>
            <button
              onClick={() => scrollTo("pricing")}
              className="border border-primary-foreground/20 text-primary-foreground px-8 py-3.5 rounded-lg text-[15px] font-medium hover:border-primary-foreground/40 transition-all"
            >
              {t.footer.cta2}
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-accent/20 rounded-lg flex items-center justify-center">
              <span className="text-accent font-serif font-bold text-sm">T</span>
            </div>
            <span className="font-serif text-lg text-primary-foreground">Tripeax</span>
          </div>
          <div className="flex gap-6">
            {t.footer.links.map((link) => (
              <span key={link} className="text-[13px] text-primary-foreground/40 cursor-pointer hover:text-primary-foreground/60 transition-colors">
                {link}
              </span>
            ))}
          </div>
          <span className="text-[13px] text-primary-foreground/30">
            {t.footer.copyright}
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
