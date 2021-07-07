import { Account } from "@/models";

export enum AccountsStatus {
  Adding = "Adding",
  Empty = "Empty",
  Failed = "Failed",
  Loaded = "Loaded",
  Loading = "Loading",
  Saving = "Saving"
}
export interface AccountsState {
  accounts: Account[]
  accountsStatus: AccountsStatus
}
