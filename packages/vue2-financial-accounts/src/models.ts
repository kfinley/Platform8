export interface AddAccountRequest {
  name: string;
  financialInstitution: string;
  accountType: string;
  startingBalance: number;
}

export interface AddAccountResponse {
  success: boolean;
  error: string | undefined;
}
