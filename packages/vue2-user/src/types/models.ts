import { AuthStatus } from "../store";

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
}

export interface RegisterResponse {
  success: boolean;
  error: string | undefined;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: AuthStatus
  session?: string | undefined;
  authenticationResult?: AuthenticationResult;
  error?: string | undefined;
}

export interface SetPasswordRequest {
  username: string;
  previousPassword: string;
  proposedPassword: string;
  session?: string | undefined;
}

export interface AuthenticationResult {
  accessToken?: string,
  expiresIn?: number;
  tokenType?: string;
  refreshToken?: string;
  idToken?: string;
}

export interface SetPasswordResponse {
  success: boolean;
  authenticationResult?: AuthenticationResult;
  error?: string | undefined;
}

export interface User {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
}

export interface GetUserDetailsRequest {
  accessToken: string
}

export interface GetUserDetailsResponse {
  username: string,
  firstName: string,
  lastName: string,
  email: string
}
