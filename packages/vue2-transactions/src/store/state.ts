import { Account } from "@platform8/vue2-accounts/src/models";
import { AccountsState } from "@platform8/vue2-accounts/src/store";
import { Transaction } from "../models";

export interface TransactionsState {
  transactions: Transaction[];
  transactionsStatus: TransactionsStatus;
  uploadStatus: UploadStatus;
  actionStatus: ActionStatus;
  actionText?: string;
  actionComponent?: string;
  actionFunction?: string; // (transactionId: string) => void;
  actionTargetId?: string;
  accounts?: Account[];
}

export enum ActionStatus {
  None = "None",
  Active = "Active"
}

export enum UploadStatus {
  None = "None",
  Uploading = "Uploading",
  Success = "Success",
  Failed = "Failed"
}

export enum TransactionsStatus {
  None = "None",
  Loading = "Loading",
  Loaded = "Loaded",
  Uploading = "Uploading",
  Failed = "Failed"
}

export interface StoreModuleStates {
  AccountsState: AccountsState,
}

