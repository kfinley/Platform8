import { Store } from "vuex";
import { getModule } from "vuex-module-decorators";
import { AccountsModule }  from "./store-modules";

let accountsModule: AccountsModule;

function initializeModules(store: Store<any>): void {
  accountsModule = getModule(AccountsModule, store);
}

export { initializeModules, accountsModule };
