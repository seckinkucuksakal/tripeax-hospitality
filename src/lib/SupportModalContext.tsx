import { createContext, useContext, useState, type ReactNode } from "react";

/** Default `support` is the sidebar “Support” entry; settings uses helpCenter & reportBug. */
export type SupportModalVariant = "support" | "helpCenter" | "reportBug";

type SupportModalContextType = {
  isOpen: boolean;
  variant: SupportModalVariant;
  openSupport: (variant?: SupportModalVariant) => void;
  closeSupport: () => void;
};

const SupportModalContext = createContext<SupportModalContextType | undefined>(undefined);

export function SupportModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [variant, setVariant] = useState<SupportModalVariant>("support");
  return (
    <SupportModalContext.Provider
      value={{
        isOpen,
        variant,
        openSupport: (v: SupportModalVariant = "support") => {
          setVariant(v);
          setIsOpen(true);
        },
        closeSupport: () => setIsOpen(false),
      }}
    >
      {children}
    </SupportModalContext.Provider>
  );
}

export function useSupportModal() {
  const ctx = useContext(SupportModalContext);
  if (!ctx) throw new Error("useSupportModal must be used within SupportModalProvider");
  return ctx;
}
