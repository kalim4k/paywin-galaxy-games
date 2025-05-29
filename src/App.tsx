
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import MinePage from "./pages/MinePage";
import AuthPage from "./pages/AuthPage";
import DicePage from "./pages/DicePage";
import WithdrawalPage from "./pages/WithdrawalPage";
import BonusPage from "./pages/BonusPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import GameNotAvailablePage from "./pages/GameNotAvailablePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            <Route path="/mine" element={
              <ProtectedRoute>
                <MinePage />
              </ProtectedRoute>
            } />
            <Route path="/dice" element={
              <ProtectedRoute>
                <DicePage />
              </ProtectedRoute>
            } />
            <Route path="/withdrawal" element={
              <ProtectedRoute>
                <WithdrawalPage />
              </ProtectedRoute>
            } />
            <Route path="/bonus" element={
              <ProtectedRoute>
                <BonusPage />
              </ProtectedRoute>
            } />
            <Route path="/leaderboard" element={
              <ProtectedRoute>
                <LeaderboardPage />
              </ProtectedRoute>
            } />
            <Route path="/game-not-available/:gameId" element={
              <ProtectedRoute>
                <GameNotAvailablePage />
              </ProtectedRoute>
            } />
            <Route path="*" element={
              <ProtectedRoute>
                <NotFound />
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
