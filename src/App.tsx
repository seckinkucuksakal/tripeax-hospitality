import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/lib/LanguageContext";
import { BookDemoModalProvider } from "@/lib/BookDemoModalContext";
import { BookDemoModal } from "@/components/BookDemoModal";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import DiscoveryCallCalendar from "./pages/DiscoveryCallCalendar.tsx";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <BookDemoModalProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/book-demo/calendar" element={<DiscoveryCallCalendar />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <BookDemoModal />
            </BrowserRouter>
          </TooltipProvider>
        </BookDemoModalProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
