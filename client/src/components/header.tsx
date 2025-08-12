import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import { useAuth } from "@/hooks/useAuth";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Header() {
  const { activeTab, setActiveTab } = useAppContext();
  const { user, logout } = useAuth();
  const { canAccessTab } = useRoleAccess();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/auth/logout");
      return await response.json();
    },
    onSuccess: () => {
      // Clear all queries from cache
      queryClient.clear();
      logout();
      toast({ title: "Logged out successfully" });
    },
    onError: (error: any) => {
      console.error("Logout error:", error);
      // Still logout on client side even if server fails
      queryClient.clear();
      logout();
      toast({ title: "Logged out" });
    },
  });

  const handleProfile = () => {
    // Navigate to Access User Profiles page to view current user's profile
    setActiveTab("Access User Profiles");
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const allTabs = [
    "Landing page",
    "Qualifications", 
    "Positions | Roles",
    "Access User Profiles",
    "Tenders",
    "Capture record"
  ];

  // Filter tabs based on user role permissions
  const tabs = allTabs.filter(tab => {
    // For users, hide "Capture record" from navbar since it's their default page
    if (user?.role === 'user' && tab === "Capture record") {
      return false;
    }
    return canAccessTab(tab);
  });

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img 
                className="h-10 w-auto" 
                src="/assets/alteram-logo.png" 
                alt="Alteram Logo" 
              />
            </div>
            {user && (
              <div className="ml-8 text-sm text-gray-600">
                {user.role === 'user' ? (
                  <>
                    Welcome
                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {user.role}
                    </span>
                  </>
                ) : (
                  <>
                    Welcome, <span className="font-medium">{user.firstName || user.username}</span>
                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {user.role}
                    </span>
                  </>
                )}
              </div>
            )}
            <div className="ml-16 flex space-x-3 mr-8">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                    activeTab === tab
                      ? "bg-orange-500 text-white"
                      : "text-orange-500 hover:bg-orange-50 border border-orange-300"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Hide profile button for users and managers */}
            {user?.role === 'admin' && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleProfile}
                className="btn-icon"
              >
                <User className="w-4 h-4" />
                Profile
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              className="btn-icon"
              disabled={logoutMutation.isPending}
            >
              <LogOut className="w-4 h-4" />
              {logoutMutation.isPending ? "Logging out..." : "Logout"}
            </Button>
          </div>
        </div>

      </div>
    </header>
  );
}
