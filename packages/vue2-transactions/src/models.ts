export interface Transaction {
  id: string;
  date: Date;
  description: string;
  amount: number;
  accountId: string;
  linkedItems?: linkedItem[];
  hasChanges: boolean;
}

// TODO: consider renaming...
export enum TransactionStatus { 
  All = "All",
  Reviewed = "Reviewed",
  Unreviewed = "Unreviewed"
}

export interface linkedItem {
  type: string;
  id: string;
  attributes: Record<string, object>;
}

export interface TransactionInList extends Transaction {
  account: string;
}

export interface LoadTransactionsRequest  {
  status: TransactionStatus; // TODO: consider renaming...
}

export interface LoadTransactionsResponse  {
  transactions: Transaction[];
  error?: string;
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
