import { useQuery } from "@tanstack/react-query";
import { authApi, userApi } from "../lib/api";
import { tokenService } from "../lib/token";
import type { User } from "../types/auth";

export const useUserQuery = (isInitialized: boolean) => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async (): Promise<User | null> => {
      const accessToken = tokenService.getAccessToken();
      if (!accessToken) {
        try {
          const refreshResponse = await authApi.refresh();
          tokenService.setAccessToken(refreshResponse.accessToken);
          return refreshResponse.user;
        } catch (error) {
          tokenService.clearAccessToken();
          return null;
        }
      }

      try {
        const userData = await userApi.getMe();
        return userData;
      } catch (error) {
        tokenService.clearAccessToken();
        return null;
      }
    },
    enabled: isInitialized,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
