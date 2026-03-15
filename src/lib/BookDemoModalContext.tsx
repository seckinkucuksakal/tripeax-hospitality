import { createContext, useContext, useState, type ReactNode } from "react";

type BookDemoModalContextType = {
  isOpen: boolean;
  openBookDemo: () => void;
  closeBookDemo: () => void;
};

const BookDemoModalContext = createContext<BookDemoModalContextType | undefined>(undefined);

export function BookDemoModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <BookDemoModalContext.Provider
      value={{
        isOpen,
        openBookDemo: () => setIsOpen(true),
        closeBookDemo: () => setIsOpen(false),
      }}
    >
      {children}
    </BookDemoModalContext.Provider>
  );
}

export function useBookDemoModal() {
  const ctx = useContext(BookDemoModalContext);
  if (!ctx) throw new Error("useBookDemoModal must be used within BookDemoModalProvider");
  return ctx;
}
