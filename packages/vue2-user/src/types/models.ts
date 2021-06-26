export interface RegistrationRequest {
  firstName: string;
  lastName: string;
  email: string;
}

export interface RegistrationResponse {
  success: boolean;
  error: string | undefined;
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
