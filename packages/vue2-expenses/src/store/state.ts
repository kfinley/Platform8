import { Expense } from "../models";

export interface ExpensesState {
  expenses: Expense[],
  status: ExpensesStatus,  
}

export enum ExpensesStatus {
  None = "None",
  Loading = "Loading",
  Loaded = "Loaded",
  Adding = "Adding",
  Failed = "Failed"
}
