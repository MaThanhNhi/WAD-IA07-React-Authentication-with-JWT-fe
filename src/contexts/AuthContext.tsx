import React, { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "../lib/api";
import { tokenService } from "../lib/token";
import { useUserQuery } from "../hooks";
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

  const { data: user, isLoading, refetch } = useUserQuery(isInitialized);

  useEffect(() => {
    setIsInitialized(true);
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "logout-event") {
        tokenService.clearAccessToken();
        window.location.href = "/login";
      }
    };

    window.addEventListener("storage", handleStorageChange);
    const handleTokenRefresh = async () => {
      try {
        const response = await authApi.refresh();
        tokenService.setAccessToken(response.accessToken);
        refetch();
      } catch (error) {
        tokenService.clearAccessToken();
        window.location.href = "/login";
      }
    };
    window.addEventListener("token-refresh-needed", handleTokenRefresh);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("token-refresh-needed", handleTokenRefresh);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
