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
import AuthPage from "./pages/AuthPage.tsx";
import BusinessSelectionPage from "./pages/BusinessSelectionPage.tsx";
import RestaurantBusinessProfilePage from "./pages/RestaurantBusinessProfilePage.tsx";
import HotelBusinessProfilePage from "./pages/HotelBusinessProfilePage.tsx";
import HotelOnboardingStep3Page from "./pages/HotelOnboardingStep3Page.tsx";
import HotelOnboardingStep4Page from "./pages/HotelOnboardingStep4Page.tsx";
import HotelOnboardingStep5Page from "./pages/HotelOnboardingStep5Page.tsx";
import HotelOnboardingStep6Page from "./pages/HotelOnboardingStep6Page.tsx";
import RestaurantOnboardingStep3Page from "./pages/RestaurantOnboardingStep3Page.tsx";
import RestaurantOnboardingStep4Page from "./pages/RestaurantOnboardingStep4Page.tsx";
import RestaurantOnboardingStep5Page from "./pages/RestaurantOnboardingStep5Page.tsx";
import RestaurantOnboardingStep6Page from "./pages/RestaurantOnboardingStep6Page.tsx";
import RestaurantOnboardingStep7Page from "./pages/RestaurantOnboardingStep7Page.tsx";
import RestaurantOnboardingStep8Page from "./pages/RestaurantOnboardingStep8Page.tsx";
import RestaurantOnboardingStep9Page from "./pages/RestaurantOnboardingStep9Page.tsx";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <BookDemoModalProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter
              future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
              }}
            >
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/book-demo/calendar" element={<DiscoveryCallCalendar />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/business-selection" element={<BusinessSelectionPage />} />
                <Route path="/onboarding/business-profile/restaurant" element={<RestaurantBusinessProfilePage />} />
                <Route path="/onboarding/business-profile/hotel" element={<HotelBusinessProfilePage />} />
                <Route path="/onboarding/hotel/step-3" element={<HotelOnboardingStep3Page />} />
                <Route path="/onboarding/hotel/step-4" element={<HotelOnboardingStep4Page />} />
                <Route path="/onboarding/hotel/step-5" element={<HotelOnboardingStep5Page />} />
                <Route path="/onboarding/hotel/step-6" element={<HotelOnboardingStep6Page />} />
                <Route path="/onboarding/restaurant/step-3" element={<RestaurantOnboardingStep3Page />} />
                <Route path="/onboarding/restaurant/step-4" element={<RestaurantOnboardingStep4Page />} />
                <Route path="/onboarding/restaurant/step-5" element={<RestaurantOnboardingStep5Page />} />
                <Route path="/onboarding/restaurant/step-6" element={<RestaurantOnboardingStep6Page />} />
                <Route path="/onboarding/restaurant/step-7" element={<RestaurantOnboardingStep7Page />} />
                <Route path="/onboarding/restaurant/step-8" element={<RestaurantOnboardingStep8Page />} />
                <Route path="/onboarding/restaurant/step-9" element={<RestaurantOnboardingStep9Page />} />
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
