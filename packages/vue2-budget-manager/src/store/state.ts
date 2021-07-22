import { Budget } from "./../models";

export enum BudgetStatus {
  None = "None",
  AddingCategory = "AddingCategory",
  Failed = "Failed",
  Loaded = "Loaded",
  Loading = "Loading",
  Saving = "Saving"
}
export interface BudgetState {
  budget: Budget
  status: BudgetStatus
}
