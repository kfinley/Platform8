export interface Expense {
  id: string;
  // transactionId: string;
  transaction: {
    id: string,
    date: Date,
    description: string,
    amount: number,
    account: string
  }
}

export interface AddExpenseRequest {
  description: string;
  amount: number;
  isFullTransaction: boolean;
  transactionId: string;
  categoryId: string;
}

export interface AddExpenseResponse {
  id: string;
  success: boolean;
  error: string;
}

export interface LoadExpensesRequest {

}

export interface LoadExpensesResponse {
  expenses: Expense[];
  error?: string;
}

export interface ExpensesModuleSettings {
  onCloseRedirectRouteName: string;
}
