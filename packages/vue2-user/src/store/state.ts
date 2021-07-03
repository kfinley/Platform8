import { User, AuthStatus, RegistrationStatus, AuthenticationResult } from "./../types";

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
}
