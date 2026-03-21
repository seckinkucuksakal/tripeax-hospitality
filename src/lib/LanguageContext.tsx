import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { translations, type Lang } from "./i18n";

type TranslationType = typeof translations.en;

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: TranslationType;
}

const defaultLanguageContext: LanguageContextType = {
  lang: "en",
  setLang: () => undefined,
  t: translations.en as TranslationType,
};

const LanguageContext = createContext<LanguageContextType>(defaultLanguageContext);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  const value = useMemo(
    () => ({
      lang,
      setLang,
      t: translations[lang] as TranslationType,
    }),
    [lang],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
