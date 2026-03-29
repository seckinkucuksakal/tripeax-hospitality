import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/lib/LanguageContext";
import { CurrencyProvider } from "@/lib/CurrencyContext";
import { BookDemoModalProvider } from "@/lib/BookDemoModalContext";
import { SupportModalProvider } from "@/lib/SupportModalContext";
import { NewReservationProvider } from "@/lib/NewReservationContext";
import { BookDemoModal } from "@/components/BookDemoModal";
import { SupportModal } from "@/components/SupportModal";
import { NewReservationModal } from "@/components/NewReservationModal";
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
import HotelOnboardingStep7Page from "./pages/HotelOnboardingStep7Page.tsx";
import HotelOnboardingStep8Page from "./pages/HotelOnboardingStep8Page.tsx";
import RestaurantOnboardingStep3Page from "./pages/RestaurantOnboardingStep3Page.tsx";
import RestaurantOnboardingStep4Page from "./pages/RestaurantOnboardingStep4Page.tsx";
import RestaurantOnboardingStep5Page from "./pages/RestaurantOnboardingStep5Page.tsx";
import RestaurantOnboardingStep6Page from "./pages/RestaurantOnboardingStep6Page.tsx";
import RestaurantOnboardingStep7Page from "./pages/RestaurantOnboardingStep7Page.tsx";
import RestaurantOnboardingStep8Page from "./pages/RestaurantOnboardingStep8Page.tsx";
import InitializingPage from "./pages/InitializingPage.tsx";
import HomePage from "./pages/HomePage.tsx";
import CallsPage from "./pages/CallsPage.tsx";
import ReservationsPage from "./pages/ReservationsPage.tsx";
import SettingsPage from "./pages/SettingsPage.tsx";
import PaymentPage from "./pages/PaymentPage.tsx";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <CurrencyProvider>
        <NewReservationProvider>
        <BookDemoModalProvider>
          <SupportModalProvider>
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
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/business-selection" element={<BusinessSelectionPage />} />
                <Route path="/onboarding/business-profile/restaurant" element={<RestaurantBusinessProfilePage />} />
                <Route path="/onboarding/business-profile/hotel" element={<HotelBusinessProfilePage />} />
                <Route path="/onboarding/hotel/step-3" element={<HotelOnboardingStep3Page />} />
                <Route path="/onboarding/hotel/step-4" element={<HotelOnboardingStep4Page />} />
                <Route path="/onboarding/hotel/step-5" element={<HotelOnboardingStep5Page />} />
                <Route path="/onboarding/hotel/step-6" element={<HotelOnboardingStep6Page />} />
                <Route path="/onboarding/hotel/step-7" element={<HotelOnboardingStep7Page />} />
                <Route path="/onboarding/hotel/step-8" element={<HotelOnboardingStep8Page />} />
                <Route path="/onboarding/restaurant/step-3" element={<RestaurantOnboardingStep3Page />} />
                <Route path="/onboarding/restaurant/step-4" element={<RestaurantOnboardingStep4Page />} />
                <Route path="/onboarding/restaurant/step-5" element={<RestaurantOnboardingStep5Page />} />
                <Route path="/onboarding/restaurant/step-6" element={<RestaurantOnboardingStep6Page />} />
                <Route path="/onboarding/restaurant/step-7" element={<RestaurantOnboardingStep7Page />} />
                <Route path="/onboarding/restaurant/step-8" element={<RestaurantOnboardingStep8Page />} />
                <Route path="/initializing" element={<InitializingPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/calls" element={<CallsPage />} />
                <Route path="/reservations" element={<ReservationsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <BookDemoModal />
              <SupportModal />
              <NewReservationModal />
            </BrowserRouter>
          </TooltipProvider>
          </SupportModalProvider>
        </BookDemoModalProvider>
        </NewReservationProvider>
        </CurrencyProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
