import React, { createContext, useContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { authApi } from "../lib/api";
import { tokenService } from "../lib/token";
import type { User } from "../types/auth";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  refetchUser: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  // Fetch current user if tokens exist
  const {
    data: user,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      console.log('[AuthContext] Query function called');
      const accessToken = tokenService.getAccessToken();
      console.log('[AuthContext] Access token exists:', !!accessToken);

      // If no access token, try to refresh from HTTP-only cookie
      if (!accessToken) {
        console.log('[AuthContext] No access token, attempting refresh from cookie');
        try {
          const refreshResponse = await authApi.refresh();
          tokenService.setAccessToken(refreshResponse.accessToken);
          console.log('[AuthContext] Refresh successful, returning user:', refreshResponse.user);
          return refreshResponse.user;
        } catch (error) {
          // Refresh failed, user is not authenticated
          console.log('[AuthContext] Refresh failed:', error);
          tokenService.clearAllTokens();
          return null;
        }
      }

      // Fetch user profile
      console.log('[AuthContext] Fetching user profile with access token');
      try {
        const userData = await authApi.getMe();
        console.log('[AuthContext] User profile fetched:', userData);
        return userData;
      } catch (error) {
        // Failed to fetch user, clear tokens
        console.log('[AuthContext] Failed to fetch user profile:', error);
        tokenService.clearAllTokens();
        return null;
      }
    },
    enabled: isInitialized,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Initialize on mount - check for existing tokens
  useEffect(() => {
    const initializeAuth = async () => {
      // Try to refresh from HTTP-only cookie on app load
      if (!tokenService.getAccessToken()) {
        try {
          const response = await authApi.refresh();
          tokenService.setAccessToken(response.accessToken);
        } catch (error) {
          // No valid session, that's okay
          tokenService.clearAllTokens();
        }
      }      setIsInitialized(true);
    };

    initializeAuth();

    // Multi-tab synchronization - listen for logout events
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'logout-event') {
        // Another tab logged out, clear tokens and redirect
        tokenService.clearAllTokens();
        window.location.href = '/login';
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Silent token refresh - listen for refresh events
    const handleTokenRefresh = async () => {
      try {
        const response = await authApi.refresh();
        tokenService.setAccessToken(response.accessToken);
        refetch(); // Refetch user data
      } catch (error) {
        console.error('Silent token refresh failed:', error);
        tokenService.clearAllTokens();
        window.location.href = '/login';
      }
    };

    window.addEventListener('token-refresh-needed', handleTokenRefresh);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('token-refresh-needed', handleTokenRefresh);
    };
  }, [refetch]);

  // Debug: Log authentication state changes
  useEffect(() => {
    console.log('[AuthContext] State updated:', {
      hasUser: !!user,
      isAuthenticated: !!user,
      isLoading: !isInitialized || isLoading,
      isInitialized,
      userId: user?.id,
      userEmail: user?.email,
      userRole: user?.role,
    });
  }, [user, isInitialized, isLoading]);

  const value: AuthContextType = {
    user: user ?? null,
    isAuthenticated: !!user,
    isLoading: !isInitialized || isLoading,
    refetchUser: async () => {
      const result = await refetch();
      return result.data ?? null;
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
