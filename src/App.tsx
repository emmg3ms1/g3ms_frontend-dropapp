import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Diamond, Loader2 } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { UserProfileHeader } from "@/components/UserProfileHeader";
import { AuthProvider } from "@/contexts/AuthContext";
import { useAuth } from "@/contexts/AuthContext";
import { DropDataProvider } from "@/contexts/DropDataContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { OnboardingGuard } from "@/components/OnboardingGuard";
import Index from "./pages/Index";
import DropCompletion from "./pages/DropCompletion";
import DropsMain from "./pages/DropsMain";
import DropsMainRestricted from "./pages/DropsMainRestricted";
import LiveDrop from "./pages/LiveDrop";
import RewardsProgress from "./pages/RewardsProgress";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Portfolio from "./pages/Portfolio";
import Billing from "./pages/Billing";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import Ayo from "./pages/Ayo";
import OnboardingRole from "./pages/OnboardingRole";
import OnboardingBirthdate from "./pages/OnboardingBirthdate";
import OnboardingPhone from "./pages/OnboardingPhone";
import OnboardingGuardian from "./pages/OnboardingGuardian";
import GuardianApproval from "./pages/GuardianApproval";
import Dashboard from "./pages/Dashboard";
import EducatorDashboard from "./pages/EducatorDashboard";
import BrandsDashboard from "./pages/BrandsDashboard";
import AuthCallback from "./pages/AuthCallback";
import Pricing from "./pages/Pricing";
import CampaignAnalytics from "./pages/CampaignAnalytics";

const queryClient = new QueryClient();

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isDropsPage = location.pathname.startsWith("/drops/");
  const isLoginPage = location.pathname === "/login";
  const isSignupPage = location.pathname === "/signup";
  const isIndexPage = location.pathname === "/";
  const isOnboardingPage = location.pathname.startsWith("/onboarding");
  const isDashboardPage = location.pathname === "/dashboard";
  const isEducatorDashboardPage = location.pathname === "/educator/dashboard";
  const isBrandsDashboardPage = location.pathname === "/brands/dashboard";
  const isGuardianApprovalPage =
    location.pathname.startsWith("/guardian/approve");

  if (isDropsPage && !isLoginPage && !isSignupPage) {
    return (
      <div className="min-h-screen bg-white overflow-x-hidden w-full max-w-full">
        <header className="h-12 flex items-center justify-between border-b bg-white px-4">
          <div className="flex items-center">
            <span className="font-semibold text-gray-900">G3MS</span>
          </div>
          <UserProfileHeader />
        </header>
        <main>{children}</main>
      </div>
    );
  }

  // For login, signup, onboarding, dashboard, and guardian approval pages, don't show header
  if (
    isLoginPage ||
    isSignupPage ||
    isOnboardingPage ||
    isDashboardPage ||
    isEducatorDashboardPage ||
    isBrandsDashboardPage ||
    isGuardianApprovalPage
  ) {
    return <>{children}</>;
  }

  // For index page, use existing layout (no header modification)
  if (isIndexPage) {
    return <>{children}</>;
  }

  // For non-drops pages, add UserProfileHeader to top right
  return (
    <div className="min-h-screen bg-white overflow-x-hidden w-full max-w-full">
      <header className="h-12 flex items-center justify-between border-b bg-white px-4">
        <div className="flex items-center">
          <span className="font-semibold text-gray-900">G3MS</span>
        </div>
        <UserProfileHeader />
      </header>
      <main>{children}</main>
    </div>
  );
};

const AppContent = () => {
  const { isLoading } = useAuth();

  // Show loading spinner while authentication state is being determined
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-g3ms-purple/5 to-g3ms-green/5">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-g3ms-purple" />
          <p className="text-sm text-muted-foreground">
            Loading your account...
          </p>
        </div>
      </div>
    );
  }

  return (
    <OnboardingGuard>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/drops/main" element={<DropsMain />} />
          <Route path="/drops/restricted" element={<DropsMainRestricted />} />
          <Route path="/drops/live" element={<LiveDrop />} />

          <Route path="/rewards-progress" element={<RewardsProgress />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/ayo" element={<Ayo />} />

          {/* Onboarding Routes */}
          <Route path="/onboarding/role" element={<OnboardingRole />} />
          <Route
            path="/onboarding/birthdate"
            element={<OnboardingBirthdate />}
          />
          <Route path="/onboarding/phone" element={<OnboardingPhone />} />
          <Route path="/onboarding/guardian" element={<OnboardingGuardian />} />
          <Route
            path="/guardian/approve/:approvalId"
            element={<GuardianApproval />}
          />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/educator/dashboard" element={<EducatorDashboard />} />
          <Route path="/brands/dashboard" element={<BrandsDashboard />} />
          <Route path="/campaigns/:campaignId/analytics" element={<CampaignAnalytics />} />
          <Route path="/pricing" element={<Pricing />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AppLayout>
    </OnboardingGuard>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <DropDataProvider>
            <AppContent />
          </DropDataProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);
export default App;
