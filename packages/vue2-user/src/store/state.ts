import { RegistrationStatus } from "./types";

export interface RegistrationState {
  error: string | undefined;
  email: string | undefined;
  status: RegistrationStatus;
}
