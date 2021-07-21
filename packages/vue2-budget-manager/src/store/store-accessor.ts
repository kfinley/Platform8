import { Store } from "vuex";
import { getModule } from "vuex-module-decorators";
import { BudgetModule }  from "./store-modules";

let budgetModule: BudgetModule;

function initializeModules(store: Store<any>): void {
  budgetModule = getModule(BudgetModule, store);
}

export { initializeModules, budgetModule };
