
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import MinePage from "./pages/MinePage";
import AuthPage from "./pages/AuthPage";
import DicePage from "./pages/DicePage";
import WithdrawalPage from "./pages/WithdrawalPage";
import BonusPage from "./pages/BonusPage";
import GameNotAvailablePage from "./pages/GameNotAvailablePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/mine" element={<MinePage />} />
          <Route path="/dice" element={<DicePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/withdrawal" element={<WithdrawalPage />} />
          <Route path="/bonus" element={<BonusPage />} />
          <Route path="/game-not-available/:gameId" element={<GameNotAvailablePage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
