// In-memory storage for access token (cleared on page refresh for security)
let accessToken: string | null = null;
let tokenExpirationTimer: ReturnType<typeof setTimeout> | null = null;

export const tokenService = {
  getAccessToken: (): string | null => {
    return accessToken;
  },

  setAccessToken: (token: string): void => {
    accessToken = token;
    tokenService.scheduleTokenRefresh();
  },

  clearAccessToken: (): void => {
    accessToken = null;
    if (tokenExpirationTimer) {
      clearTimeout(tokenExpirationTimer);
      tokenExpirationTimer = null;
    }
  },

  // Schedule automatic token refresh before expiration
  scheduleTokenRefresh: (): void => {
    if (tokenExpirationTimer) {
      clearTimeout(tokenExpirationTimer);
    }

    if (!accessToken) return;

    try {
      const payload = JSON.parse(atob(accessToken.split(".")[1]));
      const expiresAt = payload.exp * 1000;
      const now = Date.now();

      const refreshTime = expiresAt - now - 300000;

      if (refreshTime > 0) {
        tokenExpirationTimer = setTimeout(() => {
          const event = new CustomEvent("token-refresh-needed");
          window.dispatchEvent(event);
        }, refreshTime);
      }
    } catch (error) {
      console.error("Error scheduling token refresh:", error);
    }
  },
  // ==================== Utility Functions ====================

  /**
   * Check if user has an access token
   */
  hasAccessToken: (): boolean => {
    return accessToken !== null;
  },

  /**
   * Get user role from access token
   */
  getUserRole: (): string | null => {
    if (!accessToken) return null;

    try {
      const payload = JSON.parse(atob(accessToken.split(".")[1]));
      return payload.role || null;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  },

  /**
   * Check if user has a specific role
   */
  hasRole: (role: string): boolean => {
    const userRole = tokenService.getUserRole();
    return userRole === role;
  },

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole: (roles: string[]): boolean => {
    const userRole = tokenService.getUserRole();
    return userRole !== null && roles.includes(userRole);
  },
};
