import { Budget } from "./../models";

export enum BudgetStatus {
  None = "None",
  Failed = "Failed",
  Loaded = "Loaded",
  Loading = "Loading",
  Saving = "Saving"
}
export interface BudgetState {
  budget: Budget
  budgetStatus: BudgetStatus
}
