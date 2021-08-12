import { User, AuthenticationResult } from "./../types";

export interface RegistrationState {
  error: string | undefined;
  email: string | undefined;
  status: RegistrationStatus;
}
export interface UserState {
  authStatus: AuthStatus;
  authSession?: string | undefined;
  currentUser: User | undefined;
  authTokens?: AuthenticationResult | undefined;
  postAuthFunction?: string;
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
