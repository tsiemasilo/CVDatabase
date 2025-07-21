import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/header";
import CVDatabase from "@/pages/cv-database";
import Qualifications from "@/pages/qualifications";
import PositionsRoles from "@/pages/positions-roles";
import Tenders from "@/pages/tenders";
import CaptureRecord from "@/pages/capture-record";
import AccessUserProfiles from "@/pages/access-user-profiles";
import Login from "@/pages/login";
import NotFound from "@/pages/not-found";
import { AppProvider, useAppContext, type ActiveTab } from "@/contexts/AppContext";
import { useAuth } from "@/hooks/useAuth";

function MainContent({ activeTab }: { activeTab: ActiveTab }) {
  switch (activeTab) {
    case "Landing page":
      return <CVDatabase />;
    case "Qualifications":
      return <Qualifications />;
    case "Positions | Roles":
      return <PositionsRoles />;
    case "Tenders":
      return <Tenders />;
    case "Capture record":
      return <CaptureRecord />;
    case "Access User Profiles":
      return <AccessUserProfiles />;
    default:
      return <NotFound />;
  }
}

function AppContent() {
  const { activeTab } = useAppContext();
  const { isAuthenticated, isLoading, login } = useAuth();
  
  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  // Show login page if not authenticated
  if (!isAuthenticated) {
    return (
      <div>
        <Toaster />
        <Login onLoginSuccess={login} />
      </div>
    );
  }
  
  // Show main app if authenticated
  return (
    <div>
      <Toaster />
      <Header />
      <MainContent activeTab={activeTab} />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
