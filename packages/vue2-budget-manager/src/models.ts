export interface Budget {
  id: string;
  categories: Category[];
}

export interface Category {
  id: string;
  name: string;
  allocation: NumberRange;
  classifications: Record<string, string>[];
}

export interface NumberRange {
  start: number;
  end: number;
}

export interface AddCategoryRequest {
  name: string;
  allocation: NumberRange;
}

export interface AddCategoryResponse {
  id: string;
  budgetId: string;
  success: boolean;
  error: string | undefined;
}

export interface GetBudgetRequest { }

export interface GetBudgetResponse {
  budget: Budget;
  error: string | undefined;
}

export interface BudgetModuleSettings {
  onCloseRedirectRouteName: string;
}
