export interface RegistrationRequest {
  firstName: string;
  lastName: string;
  email: string;
}

export interface RegistrationResponse {
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

export enum RegistrationStatus {
  Unknown = 'Unknown',
  Failed = 'Failed',
  Registered = 'Registered',
  Registering = 'Registering',
  Success = 'Success'
}

export enum AuthStatus {
  LoggedOut = 'LoggedOut',
  LoggingIn = 'LoggingIn',
  LoggedIn = 'LoggedIn',
  LoginFailed = 'LoginFailed',
  NewPasswordRequired = 'NewPasswordRequired',
  SettingPassword = 'SettingPassword',
  Refreshing = 'Refreshing',    // ???
  Registering = 'Registering',  // ???
  Locked = 'Locked',
}

export interface User {
  id: string;
}

export enum AlertType {
  danger = "danger",
  dark = "dark",
  info = "info",
  light = "light",
  primary = "primary",
  secondary = "secondary",
  success = "success",
  warning = "warning",
}

export interface Notification {
  header?: string;
  message: string;
  type: AlertType;
}


