export interface Transaction {
  id: string,
  date: Date,
  description: string,
  amount: number,
  accountId: string
}

export interface TransactionInList extends Transaction {
  account: string
}

export interface LoadTransactionsRequest  {

}

export interface LoadTransactionsResponse  {
  transactions: Transaction[],
  error?: string
}

export interface UploadFileRequest {
  accountId: string;
  bucket: string;
  file: File;
}

export interface UploadFileResponse {
  success: boolean;
  error?: string | undefined;
}
