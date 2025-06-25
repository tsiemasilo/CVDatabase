import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState, createContext, useContext } from "react";
import Header from "@/components/header";
import CVDatabase from "@/pages/cv-database";
import Qualifications from "@/pages/qualifications";
import NotFound from "@/pages/not-found";

type ActiveTab = "Landing page" | "Qualifications" | "Positions | Roles" | "Access User Profiles" | "Tenders" | "Capture record";

interface AppContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within App component");
  }
  return context;
};

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

function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("Landing page");

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppContext.Provider value={{ activeTab, setActiveTab }}>
          <div>
            <Toaster />
            <Header />
            <MainContent activeTab={activeTab} />
          </div>
        </AppContext.Provider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
