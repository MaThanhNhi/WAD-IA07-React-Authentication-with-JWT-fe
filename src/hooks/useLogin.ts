import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";
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
  const queryClient = useQueryClient();

  return useMutation<LoginResponse, ApiError, LoginPayload>({
    mutationFn: (data: LoginPayload) => authApi.login(data),

    onSuccess: (data) => {
      tokenService.setAccessToken(data.accessToken);
      queryClient.setQueryData(["currentUser"], data.user);
      options?.onSuccess?.(data);
    },

    onError: (error) => {
      tokenService.clearAccessToken();
      options?.onError?.(error);
    },

    onSettled: () => {
      options?.onSettled?.();
    },

    retry: false,
    networkMode: "online",
  });
};

export type UseLoginReturn = ReturnType<typeof useLogin>;
