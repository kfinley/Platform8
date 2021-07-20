import { Transaction } from "../models";

export interface TransactionsState {
  transactions: Transaction[],
  transactionsStatus: TransactionsStatus,
  uploadStatus: UploadStatus
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