export interface Transaction {
  id?: string;
  date: Date;
  sequence: number;
  description: string;
  amount: number;
  extendedDetails?: string;
  appearsOnStatementAs?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  reference?: string;
  category?: string;
  accountId?: string;
  linkedItems?: LinkedItem[];
}

export interface LinkedItem {
  id?: string;
  attributes: Record<string, any>;
}

export interface GetFileProcessorRequest {
  text: string;
}

export interface GetFileProcessorResponse {
  processor: FileProcessors;
}

export enum FileProcessors {
  Unknown = "Unknown",
  BankOfAmericaCheckingTransactions = "BankOfAmericaCheckingTransactions",
  AmericanExpressCreditCardActivity = "AmericanExpressCreditCardActivity"
}

export interface ProcessFileRequest {
  processor: FileProcessors;
  bucket: string;
  key: string;
}

export interface ProcessFileResponse<T> {
  success: boolean;
  data: T;
}

export interface FileParserRequest {
  text: string;
}

export interface ParsedTransactions {
  beginningBalance?: number;
  endingBalance?: number;
  startDate: Date;
  endDate: Date;
  transactions: Array<Transaction>;
}

export interface FileParserResponse<T> {
  success: boolean;
  data: T;
}

export interface SaveTransactionsRequest {
  ownerId: string;
  accountId: string;
  transactions: Array<Transaction>;
}

export interface SaveTransactionsResponse {
  success: boolean;
  count: number;
  saved: number;
}

export interface GetTransactionRequest {
  ownerId: string;
  accountId?: string;
  transaction?: Transaction;
  id?: string;
}

export interface GetTransactionResponse {
  id?: string;
  data?: Transaction;
}
