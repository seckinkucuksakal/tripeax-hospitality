import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BookDemoModal } from "@/components/BookDemoModal";
import { BookDemoModalProvider } from "@/lib/BookDemoModalContext";
import { LanguageProvider } from "@/lib/LanguageContext";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const router = createBrowserRouter(
  [
    { path: "/", element: <Index /> },
    { path: "*", element: <NotFound /> },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <BookDemoModalProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <RouterProvider router={router} />
          </TooltipProvider>
          <BookDemoModal />
        </BookDemoModalProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
