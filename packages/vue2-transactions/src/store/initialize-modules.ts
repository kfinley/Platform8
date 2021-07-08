import { Store } from "vuex";
import { TransactionsModule }  from "./store-modules";

export function initializeModules(store: Store<any>): void {
  store.registerModule("Transactions", TransactionsModule);
}
