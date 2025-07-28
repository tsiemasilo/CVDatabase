import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, LogIn, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface LoginProps {
  onLoginSuccess: (user: any) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const loginMutation = useMutation({
    mutationFn: async (data: { username: string; password: string }) => {
      const response = await apiRequest("POST", "/api/auth/login", data);
      return await response.json();
    },
    onSuccess: (user) => {
      // Invalidate the auth user query to refresh authentication state
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      
      toast({ 
        title: "Login successful", 
        description: `Welcome back, ${user.firstName || user.username}!` 
      });
      onLoginSuccess(user);
    },
    onError: (error: any) => {
      toast({ 
        title: "Login failed", 
        description: error.message || "Invalid username or password",
        variant: "destructive" 
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!credentials.username || !credentials.password) {
      toast({ 
        title: "Missing credentials", 
        description: "Please enter both username and password",
        variant: "destructive" 
      });
      return;
    }
    loginMutation.mutate(credentials);
  };

  const handleInputChange = (field: string, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      {/* Background logo with low opacity */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <img 
          src="/assets/alteram-logo.png"
          alt="Alteram Background"
          className="opacity-5 w-full h-full object-contain"
        />
      </div>
      
      <Card className="w-full max-w-md shadow-xl relative z-10">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <img 
              src="/assets/alteram-logo.png"
              alt="Alteram Solutions"
              className="h-16 w-auto"
            />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to access the Alteram CV Management System
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={credentials.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                disabled={loginMutation.isPending}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={credentials.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  disabled={loginMutation.isPending}
                  className="w-full pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loginMutation.isPending}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          {/* Demo credentials info */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Demo Credentials:</h4>
            <div className="text-xs space-y-1 text-gray-600 dark:text-gray-400">
              <div><strong>Admin:</strong> admin / admin1</div>
              <div><strong>Manager:</strong> mng / mng1</div>
              <div><strong>User:</strong> user / user1</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}