export interface Account {
  id: string,
  name: string,
  financialInstitution?: string | undefined,
  accountType?: string | undefined,
  balance: number;
}
export interface AddAccountRequest {
  name: string;
  financialInstitution: string;
  accountType: string;
  startingBalance: number;
}

export interface AddAccountResponse {
  id: string;
  success: boolean;
  error: string | undefined;
}

export interface LoadAccountsRequest {

}

export interface LoadAccountsResponse {
  accounts: Account[]
}
