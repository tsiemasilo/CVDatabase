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
import SuccessPage from "@/pages/success";
import NotFound from "@/pages/not-found";
import { AppProvider, useAppContext, type ActiveTab } from "@/contexts/AppContext";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";

function MainContent({ activeTab }: { activeTab: ActiveTab }) {
  // Check if we should show success page
  const [showSuccessPage, setShowSuccessPage] = useState(false);
  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    setShowSuccessPage(success === 'true');
  }, []);

  if (showSuccessPage) {
    return <SuccessPage />;
  }

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
  const { activeTab, setActiveTab } = useAppContext();
  const { isAuthenticated, isLoading, login, user } = useAuth();
  
  // Set initial tab based on user role
  useEffect(() => {
    if (user && user.role === 'user') {
      setActiveTab("Capture record");
    } else if (user && (user.role === 'admin' || user.role === 'manager')) {
      setActiveTab("Landing page");
    }
  }, [user, setActiveTab]);

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
