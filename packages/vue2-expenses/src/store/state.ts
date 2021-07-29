import { Expense } from "../models";

export interface ExpensesState {
  expenses: Expense[],
  status: ExpensesStatus,
  addActionStatus: ActionStatus
}

export enum ExpensesStatus {
  None = "None",
  Loading = "Loading",
  Loaded = "Loaded",
  Adding = "Adding",  
  Failed = "Failed"
}

export enum ActionStatus {
  None = "None",
  Loading = "Loading",
  Loaded = "Loaded",
  Saving = "Saving",
  Saved = "Saved",
  Failed = "Failed"
}
