import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
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
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (currentUser) {
      setIsAuthenticated(true);
      setUser(currentUser as AuthUser);
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, [currentUser]);

  const login = (userData: AuthUser) => {
    setIsAuthenticated(true);
    setUser(userData);
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