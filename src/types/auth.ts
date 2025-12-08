// ==================== Request Payloads ====================

export interface RegisterPayload {
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

// ==================== Response Types ====================

export type Role = 'USER' | 'ADMIN' | 'MODERATOR';

export interface User {
  id: string;
  email: string;
  role: Role;
  createdAt: string;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
  // refreshToken is in HTTP-only cookie, not in response
}

export interface RefreshResponse {
  accessToken: string;
  user: User;
  // refreshToken is in HTTP-only cookie, not in response
}

export interface Session {
  id: string;
  createdAt: string;
  lastUsedAt: string;
  expiresAt: string;
  userAgent?: string;
  ipAddress?: string;
}
