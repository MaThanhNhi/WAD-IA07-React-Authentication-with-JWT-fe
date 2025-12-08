import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { authApi } from "../lib/api";
import { tokenService } from "../lib/token";
import type { LoginPayload, LoginResponse } from "../types/auth";
import type { ApiError } from "../types/error";

interface UseLoginOptions {
  onSuccess?: (data: LoginResponse) => void;
  onError?: (error: ApiError) => void;
  onSettled?: () => void;
}

export const useLogin = (
  options?: UseLoginOptions,
): UseMutationResult<LoginResponse, ApiError, LoginPayload> => {
  return useMutation<LoginResponse, ApiError, LoginPayload>({
    mutationFn: (data: LoginPayload) => authApi.login(data),

    onSuccess: (data) => {
      // Store access token (refresh token is in HTTP-only cookie)
      tokenService.setAccessToken(data.accessToken);

      // Call user-provided onSuccess callback
      options?.onSuccess?.(data);
    },

    onError: (error) => {
      // Clear any existing tokens on login failure
      tokenService.clearAllTokens();
      
      options?.onError?.(error);
    },

    onSettled: () => {
      options?.onSettled?.();
    },

    retry: false, // Don't retry on failure
    networkMode: "online",
  });
};

export type UseLoginReturn = ReturnType<typeof useLogin>;
