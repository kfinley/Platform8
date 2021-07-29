export interface Expense {
  id: string;
  transactionId: string;
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
