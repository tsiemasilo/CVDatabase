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
import NotFound from "@/pages/not-found";
import { AppProvider, useAppContext, type ActiveTab } from "@/contexts/AppContext";

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
