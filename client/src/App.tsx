import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/header";
import CVDatabase from "@/pages/cv-database";
import Qualifications from "@/pages/qualifications";
import PositionsRoles from "@/pages/positions-roles";
import NotFound from "@/pages/not-found";
import { AppProvider, useAppContext, type ActiveTab } from "@/contexts/AppContext";

function MainContent({ activeTab }: { activeTab: ActiveTab }) {
  switch (activeTab) {
    case "Landing page":
      return <CVDatabase />;
    case "Qualifications":
      return <Qualifications />;
    case "Positions | Roles":
    case "Access User Profiles":
    case "Tenders":
    case "Capture record":
      return (
        <div className="bg-gray-50 font-sans min-h-screen">
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">{activeTab}</h2>
              <p className="text-gray-500">This section is coming soon.</p>
            </div>
          </main>
        </div>
      );
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
