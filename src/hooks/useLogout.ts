import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authApi } from "../lib/api";
import { tokenService } from "../lib/token";
import type { ApiError } from "../types/error";

interface UseLogoutOptions {
  onSuccess?: () => void;
  onError?: (error: ApiError) => void;
}

export const useLogout = (options?: UseLogoutOptions) => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      // Call logout endpoint to invalidate refresh token on server
      await authApi.logout();
    },

    onSuccess: () => {
      // Clear all tokens from storage
      tokenService.clearAllTokens();

      // Call user-provided onSuccess callback
      options?.onSuccess?.();

      // Redirect to login page
      navigate("/login");
    },

    onError: (error: ApiError) => {
      // Even if logout request fails, clear tokens locally
      tokenService.clearAllTokens();

      // Call user-provided onError callback
      options?.onError?.(error);

      // Still redirect to login
      navigate("/login");
    },

    retry: false,
  });
};

export type UseLogoutReturn = ReturnType<typeof useLogout>;
