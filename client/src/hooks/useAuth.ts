import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'super_user' | 'manager' | 'user';
  firstName?: string;
  lastName?: string;
  department?: string;
  position?: string;
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  
  // Query to check current authentication status
  const { data: currentUser, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    queryFn: async () => {
      console.log("🔍 Checking authentication status...");
      const res = await fetch("/api/auth/user", {
        credentials: "include",
      });
      
      console.log("🔍 Auth check response:", res.status, res.statusText);
      
      if (res.status === 401) {
        console.log("❌ User not authenticated");
        return null; // Not authenticated
      }
      
      if (!res.ok) {
        console.error("❌ Auth check failed:", res.status, res.statusText);
        throw new Error(`${res.status}: ${res.statusText}`);
      }
      
      const userData = await res.json();
      console.log("✅ User authenticated:", userData);
      return userData;
    },
    retry: false,
    refetchOnWindowFocus: true, // Enable refetch on focus to catch session changes
    refetchOnMount: true,
  });

  useEffect(() => {
    if (currentUser) {
      setIsAuthenticated(true);
      setUser(currentUser);
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, [currentUser]);

  const login = (userData: AuthUser) => {
    console.log("✅ Login successful for user:", userData);
    setIsAuthenticated(true);
    setUser(userData);
    // Force a refetch of the auth user to ensure state is in sync
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    // Redirect to login page after logout
    window.location.href = "/login";
  };

  return {
    isAuthenticated,
    user,
    login,
    logout,
    isLoading: isLoading && currentUser === undefined,
    error,
  };
}