export enum AccountsStatus {
  Adding = "Adding",
  Empty = "Empty",
  Failed = "Failed",
  Loaded = "Loaded",
  Loading = "Loading",
  Saving = "Saving"
}
export interface AccountsState {
  accounts: any[]
  accountsStatus: AccountsStatus
}
