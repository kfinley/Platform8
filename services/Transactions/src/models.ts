export interface Transaction {
  id?: string,
  date: Date,
  description: string,
  amount: number
}

export interface GetFileProcessorRequest {
  text: string;
}

export interface GetFileProcessorResponse {
  processor: FileProcessors;
}

export enum FileProcessors {
  Unknown = "Unknown",
  BankOfAmericaCheckingTransactions = "BankOfAmericaCheckingTransactions"
}

export interface ProcessFileRequest {
  processor: FileProcessors,
  bucket: string,
  key: string
}

export interface ProcessFileResponse<T> {
  success: boolean;
  data: T;
}

export interface FileParserRequest {
  text: string;
}

export interface ParsedTransactions {
  beginningBalance: number;
  endingBalance: number;
  startDate: Date;
  endDate: Date;
  transactions: Array<Transaction>
}

export interface FileParserResponse<T> {
  success: boolean;
  data: T;
}


export interface SaveTransactionsRequest {
  userId: string;
  accountId: string;
  transactions: Array<Transaction>;
}

export interface SaveTransactionsResponse {
  success: boolean;
  count: number;
  saved: number;
}


export interface GetTransactionRequest {
  userId: string;
  accountId: string;
  transaction?: Transaction;
  id?: string;
}

export interface GetTransactionResponse {
  data?: Transaction;
}
