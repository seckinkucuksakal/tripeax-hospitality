import { useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/lib/LanguageContext";

function industryToBusinessType(
  industry: string,
  lang: "en" | "tr"
): "restaurant" | "hotel" | null {
  if (lang === "tr") {
    if (industry.includes("Restoran")) return "restaurant";
    if (industry.includes("Otel")) return "hotel";
    return null;
  }
  const lower = industry.toLowerCase();
  if (lower.includes("restaurant")) return "restaurant";
  if (lower.includes("hotel")) return "hotel";
  return null;
}

function splitFullName(full: string): { firstName: string; lastName: string } {
  const parts = full.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: "", lastName: "" };
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

const DemoSection = () => {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const industries = t.demo.industries;
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [industry, setIndustry] = useState(() => industries[0] ?? "");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const { firstName, lastName } = splitFullName(name);
    const businessType = industryToBusinessType(industry, lang);
    navigate("/book-demo/calendar", {
      state: {
        businessType,
        interests: [] as string[],
        step3: {},
        details: { firstName, lastName, email: "" },
        step5: {
          phone: phone.trim(),
          businessName: industry,
          notes: "",
          agreed: true,
        },
      },
    });
  };

  return (
    <section id="demo" className="py-24">
      <div className="container max-w-[480px] text-center">
        <h2 className="font-serif text-display text-foreground mb-3">
          {t.demo.headline}
        </h2>
        <p className="text-base text-muted-foreground mb-10">
          {t.demo.subhead}
        </p>

        <form
          onSubmit={handleSubmit}
          className="border border-border rounded-2xl p-9 bg-card shadow-sm text-left space-y-4"
        >
          <div>
            <label className="block text-[13px] font-semibold text-foreground mb-1.5">{t.demo.name}</label>
            <input
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.demo.namePlaceholder}
              className="w-full rounded-lg border border-border bg-background px-3.5 py-3 text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-foreground mb-1.5">{t.demo.phone}</label>
            <input
              required
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t.demo.phonePlaceholder}
              className="w-full rounded-lg border border-border bg-background px-3.5 py-3 text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-foreground mb-1.5">{t.demo.industry}</label>
            <select
              required
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3.5 py-3 text-[15px] text-foreground focus:outline-none"
            >
              {industries.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
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
      </div>
    </section>
  );
};

export default DemoSection;
