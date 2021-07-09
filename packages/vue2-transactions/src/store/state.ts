export interface TransactionsState {
  transactions: any[],
  uploadStatus: UploadStatus
}

export enum UploadStatus {
  None = "None",
  Uploading = "Uploading",
  Success = "Success",
  Fialed = "Failed"
}