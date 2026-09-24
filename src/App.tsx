import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Index from "./pages/Index";
import StudentPage from "./pages/StudentPage";
import TrainerPage from "./pages/TrainerPage";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import { useAuth } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const RoleGuard = ({ role, children }: { role: "student" | "trainer"; children: React.ReactNode }) => {
  const { user, userRole, loading } = useAuth();
  if (loading) return <div className="min-h-screen grid place-items-center">Loading…</div>;
  if (!user) return <Navigate to={`/auth?role=${role}`} replace />;
  if (userRole !== role) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/student" element={<RoleGuard role="student"><StudentPage /></RoleGuard>} />
          <Route path="/trainer" element={<RoleGuard role="trainer"><TrainerPage /></RoleGuard>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
