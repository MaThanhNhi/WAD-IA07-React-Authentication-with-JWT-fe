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
    screen.width + 'x' + screen.height,
  ];
  return btoa(components.join('|'));
};

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    "X-Fingerprint": generateFingerprint(),
  },
  timeout: 10000, // 10 seconds timeout
  withCredentials: true, // Enable cookies for HTTP-only refresh tokens
});

// ==================== Request Interceptor ====================
// Automatically attach access token to all requests

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

// ==================== Response Interceptor ====================
// Handle token refresh on 401 errors

apiClient.interceptors.response.use(
  (response) => response, // Pass through successful responses
  async (error) => {
    const originalRequest = error.config;

    // Format error response
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
          // Queue this request while refresh is in progress
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
          // Attempt to refresh the access token
          // No need to send refreshToken - it's in HTTP-only cookie
          const response = await axios.post<RefreshResponse>(
            `${API_URL}/auth/refresh`,
            {}, // Empty body - backend reads cookie
            { withCredentials: true }
          );

          const { accessToken: newAccessToken } = response.data;

          // Store new access token
          tokenService.setAccessToken(newAccessToken);

          // Update the failed request with new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          // Process queued requests
          processQueue();
          isRefreshing = false;

          // Retry the original request
          return apiClient(originalRequest);
        } catch (refreshError) {
          // Refresh failed, log out user
          processQueue();
          isRefreshing = false;
          tokenService.clearAllTokens();
          
          // Broadcast logout to other tabs
          window.localStorage.setItem('logout-event', Date.now().toString());
          
          window.location.href = "/login";
          return Promise.reject(apiError);
        }
      }

      return Promise.reject(apiError);
    }

    // Network error or timeout
    const networkError: ApiError = {
      message: error.message || "Network error occurred",
      statusCode: 0,
    };
    return Promise.reject(networkError);
  },
);

// ==================== Auth API ====================

export const authApi = {
  /**
   * Login with email and password
   * Refresh token is automatically set in HTTP-only cookie
   */
  login: async (data: LoginPayload): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>("/auth/login", data);
    return response.data;
  },

  /**
   * Refresh access token using refresh token from HTTP-only cookie
   */
  refresh: async (): Promise<RefreshResponse> => {
    const response = await apiClient.post<RefreshResponse>("/auth/refresh", {});
    return response.data;
  },

  /**
   * Logout and invalidate refresh token cookie
   */
  logout: async (): Promise<void> => {
    await apiClient.post("/auth/logout", {});
    // Broadcast logout to other tabs
    window.localStorage.setItem('logout-event', Date.now().toString());
  },

  /**
   * Logout from all devices
   */
  logoutAllDevices: async (): Promise<void> => {
    await apiClient.post("/auth/logout-all", {});
    // Broadcast logout to other tabs
    window.localStorage.setItem('logout-event', Date.now().toString());
  },

  /**
   * Get current authenticated user profile
   */
  getMe: async (): Promise<User> => {
    const response = await apiClient.get<User>("/auth/me");
    return response.data;
  },

  /**
   * Get all active sessions
   */
  getSessions: async (): Promise<any[]> => {
    const response = await apiClient.get("/auth/sessions");
    return response.data;
  },

  /**
   * Revoke a specific session
   */
  revokeSession: async (sessionId: string): Promise<void> => {
    await apiClient.delete(`/auth/sessions/${sessionId}`);
  },
};

// ==================== User API ====================

export const userApi = {
  register: async (data: RegisterPayload): Promise<RegisterResponse> => {
    const response = await apiClient.post<RegisterResponse>(
      "/user/register",
      data,
    );
    return response.data;
  },
};

export { API_URL };
export type { ApiError };
