import { Store } from "vuex";
import { ExpensesModule }  from "./expensesModule";
import { getModule } from "vuex-module-decorators";

let expensesModule: ExpensesModule;

export function initializeModules(store: Store<any>): void {
  expensesModule = getModule(ExpensesModule, store);
}

export { expensesModule as expensesModule };
