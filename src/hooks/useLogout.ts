import { useMutation, useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await authApi.logout();
    },

    onSuccess: () => {
      tokenService.clearAccessToken();
      queryClient.setQueryData(["currentUser"], null);
      options?.onSuccess?.();
      navigate("/login", { replace: true });
    },

    onError: (error: ApiError) => {
      tokenService.clearAccessToken();
      queryClient.setQueryData(["currentUser"], null);
      options?.onError?.(error);
      navigate("/login", { replace: true });
    },

    retry: false,
  });
};

export type UseLogoutReturn = ReturnType<typeof useLogout>;
