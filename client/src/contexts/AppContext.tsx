import { createContext, useContext, useState, ReactNode } from "react";

type ActiveTab = "Landing page" | "Qualifications" | "Positions | Roles" | "Access User Profiles" | "Tenders" | "Capture record";

interface AppContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("Landing page");

  return (
    <AppContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </AppContext.Provider>
  );
};

export type { ActiveTab };