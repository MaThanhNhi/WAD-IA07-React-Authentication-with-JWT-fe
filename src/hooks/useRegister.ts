import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { authApi } from "../lib/api";
import type { RegisterPayload, RegisterResponse } from "../types/auth";
import type { ApiError } from "../types/error";

interface UseRegisterOptions {
  onSuccess?: (data: RegisterResponse) => void;
  onError?: (error: ApiError) => void;
  onSettled?: () => void;
}

export const useRegister = (
  options?: UseRegisterOptions,
): UseMutationResult<RegisterResponse, ApiError, RegisterPayload> => {
  return useMutation<RegisterResponse, ApiError, RegisterPayload>({
    mutationFn: (data: RegisterPayload) => authApi.register(data),
    ...options,
    retry: false, // Don't retry on failure (user input errors)
    networkMode: "online", // Only run when online
  });
};

export type UseRegisterReturn = ReturnType<typeof useRegister>;
