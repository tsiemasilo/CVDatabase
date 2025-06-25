import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";

export default function Header() {
  const handleProfile = () => {
    // TODO: Implement profile functionality
    console.log("Profile clicked");
  };

  const handleLogout = () => {
    // TODO: Implement logout functionality
    console.log("Logout clicked");
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img 
                className="h-10 w-auto" 
                src="/assets/alteram-logo.png" 
                alt="Alteram Logo" 
              />
            </div>
            <div className="ml-6">
              <h1 className="text-xl font-semibold text-gray-900">CV Database Management</h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleProfile}
              className="btn-icon"
            >
              <User className="w-4 h-4" />
              Profile
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              className="btn-icon"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
