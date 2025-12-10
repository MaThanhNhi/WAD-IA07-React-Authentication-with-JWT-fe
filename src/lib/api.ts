import axios from "axios";
import type {
  RegisterPayload,
  RegisterResponse,
  LoginPayload,
  LoginResponse,
  RefreshResponse,
  User,
} from "../types/auth";
import type { ApiError } from "../types/error";
import { tokenService } from "./token";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Device fingerprint generation (simple version)
const generateFingerprint = (): string => {
  const components = [
    navigator.userAgent,
    navigator.language,
    new Date().getTimezoneOffset(),
    screen.colorDepth,
    screen.width + "x" + screen.height,
  ];
  return btoa(components.join("|"));
};

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    "X-Fingerprint": generateFingerprint(),
  },
  timeout: 10000, // 10 seconds timeout
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: ApiError | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });

  failedQueue = [];
};

apiClient.interceptors.request.use(
  (config) => {
    const accessToken = tokenService.getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.data) {
      const apiError: ApiError = {
        message: error.response.data.message || "An unexpected error occurred",
        error: error.response.data.error,
        statusCode: error.response.data.statusCode || error.response.status,
      };

      // Handle 401 Unauthorized - Token expired
      if (
        error.response.status === 401 &&
        !originalRequest._retry &&
        originalRequest.url !== "/auth/login" &&
        originalRequest.url !== "/auth/refresh"
      ) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(() => {
              return apiClient(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const response = await axios.post<RefreshResponse>(
            `${API_URL}/auth/refresh`,
            {},
            { withCredentials: true },
          );

          const { accessToken: newAccessToken } = response.data;

          tokenService.setAccessToken(newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          processQueue();
          isRefreshing = false;
          return apiClient(originalRequest);
        } catch (refreshError) {
          processQueue();
          isRefreshing = false;
          tokenService.clearAccessToken();
          window.localStorage.setItem("logout-event", Date.now().toString());
          window.location.href = "/login";
          return Promise.reject(apiError);
        }
      }

      return Promise.reject(apiError);
    }

    const networkError: ApiError = {
      message: error.message || "Network error occurred",
      statusCode: 0,
    };
    return Promise.reject(networkError);
  },
);

// ==================== Auth API ====================

export const authApi = {
  register: async (data: RegisterPayload): Promise<RegisterResponse> => {
    const response = await apiClient.post<RegisterResponse>(
      "/auth/register",
      data,
    );
    return response.data;
  },

  login: async (data: LoginPayload): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>("/auth/login", data);
    return response.data;
  },

  refresh: async (): Promise<RefreshResponse> => {
    const response = await apiClient.post<RefreshResponse>("/auth/refresh", {});
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post("/auth/logout", {});
    window.localStorage.setItem("logout-event", Date.now().toString());
  },

  logoutAllDevices: async (): Promise<void> => {
    await apiClient.post("/auth/logout-all", {});
    window.localStorage.setItem("logout-event", Date.now().toString());
  },

  getSessions: async (): Promise<any[]> => {
    const response = await apiClient.get("/auth/sessions");
    return response.data;
  },

  revokeSession: async (sessionId: string): Promise<void> => {
    await apiClient.delete(`/auth/sessions/${sessionId}`);
  },
};

export const userApi = {
  getMe: async (): Promise<User> => {
    const response = await apiClient.get<User>("/user/me");
    return response.data;
  },

  getAllUsers: async (): Promise<any> => {
    const response = await apiClient.get("/user/admin/users");
    return response.data;
  },

  getModerationStats: async (): Promise<any> => {
    const response = await apiClient.get("/user/moderation/stats");
    return response.data;
  },
};

export { API_URL };
export type { ApiError };
