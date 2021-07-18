import { Store } from "vuex";
import { TransactionsModule }  from "./store-modules";
import { getModule } from "vuex-module-decorators";

let transactionsModule: TransactionsModule;

export function initializeModules(store: Store<any>): void {
  transactionsModule = getModule(TransactionsModule, store);
}

export { transactionsModule };
