/**
 * Token Service
 * Manages JWT access tokens and coordinates with HTTP-only cookies for refresh tokens
 * 
 * Security:
 * - Access token: In-memory storage (cleared on page refresh)
 * - Refresh token: HTTP-only cookie (managed by backend, not accessible to JS)
 */

// In-memory storage for access token (cleared on page refresh for security)
let accessToken: string | null = null;
let tokenExpirationTimer: ReturnType<typeof setTimeout> | null = null;

export const tokenService = {
  // ==================== Access Token (In-Memory) ====================
  
  /**
   * Get the current access token from memory
   */
  getAccessToken: (): string | null => {
    return accessToken;
  },

  /**
   * Store access token in memory and set up auto-refresh
   * @param token - JWT access token
   */
  setAccessToken: (token: string): void => {
    accessToken = token;
    // Set up silent refresh 5 minutes before expiration
    tokenService.scheduleTokenRefresh();
  },

  /**
   * Clear access token from memory
   */
  clearAccessToken: (): void => {
    accessToken = null;
    if (tokenExpirationTimer) {
      clearTimeout(tokenExpirationTimer);
      tokenExpirationTimer = null;
    }
  },

  /**
   * Schedule automatic token refresh before expiration
   */
  scheduleTokenRefresh: (): void => {
    if (tokenExpirationTimer) {
      clearTimeout(tokenExpirationTimer);
    }

    if (!accessToken) return;

    try {
      // Decode token to get expiration (basic decode, no verification)
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      const expiresAt = payload.exp * 1000; // Convert to milliseconds
      const now = Date.now();
      
      // Refresh 5 minutes (300000ms) before expiration
      const refreshTime = expiresAt - now - 300000;

      if (refreshTime > 0) {
        tokenExpirationTimer = setTimeout(() => {
          // Trigger token refresh
          const event = new CustomEvent('token-refresh-needed');
          window.dispatchEvent(event);
        }, refreshTime);
      }
    } catch (error) {
      console.error('Error scheduling token refresh:', error);
    }
  },

  // ==================== Refresh Token (HTTP-Only Cookie) ====================

  /**
   * Refresh tokens are now stored in HTTP-only cookies
   * They are NOT accessible via JavaScript (more secure)
   * The backend automatically reads them from cookies
   */
  getRefreshToken: (): null => {
    // Refresh token is in HTTP-only cookie, not accessible to JS
    return null;
  },

  /**
   * Refresh tokens are managed by the backend via HTTP-only cookies
   * No need to manually set them in the frontend
   */
  setRefreshToken: (): void => {
    // No-op: Refresh token is managed via HTTP-only cookies
  },

  /**
   * Clear refresh token (handled by backend when logout is called)
   */
  clearRefreshToken: (): void => {
    // No-op: Backend clears the cookie
  },

  // ==================== Utility Functions ====================

  /**
   * Clear all tokens (called during logout)
   */
  clearAllTokens: (): void => {
    tokenService.clearAccessToken();
    tokenService.clearRefreshToken();
  },

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
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      return payload.role || null;
    } catch (error) {
      console.error('Error decoding token:', error);
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
