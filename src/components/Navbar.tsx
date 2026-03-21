import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/LanguageContext";
import { useBookDemoModal } from "@/lib/BookDemoModalContext";
import tripeaxLogo from "@/assets/tripeax-logo-transparency.png";

const Navbar = () => {
  const { lang, setLang, t } = useLanguage();
  const { openBookDemo } = useBookDemoModal();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/50 transition-all duration-300 overflow-visible">
      <div className="container flex h-[84px] items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={tripeaxLogo} alt="Tripeax" className="h-[176px] w-auto" />
        </Link>

        <div className="hidden md:flex items-center gap-8 ml-7">
          <button onClick={() => scrollTo("features")} className="text-sm text-muted-foreground hover:text-foreground transition-colors tracking-wide">
            {t.nav.features}
          </button>
          <button onClick={() => scrollTo("how-it-works")} className="text-sm text-muted-foreground hover:text-foreground transition-colors tracking-wide">
            {t.nav.howItWorks}
          </button>
          <button onClick={() => scrollTo("pricing")} className="text-sm text-muted-foreground hover:text-foreground transition-colors tracking-wide">
            {t.nav.pricing}
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-lg border border-border overflow-hidden text-sm">
            <button
              onClick={() => setLang("en")}
              className={`px-3 py-1.5 font-medium transition-colors ${
                lang === "en" ? "bg-foreground text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang("tr")}
              className={`px-3 py-1.5 font-medium transition-colors ${
                lang === "tr" ? "bg-foreground text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              TR
            </button>
          </div>

          <Button size="sm" onClick={openBookDemo} className="bg-accent text-accent-foreground hover:bg-accent/90">
            {t.nav.bookDemo}
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
