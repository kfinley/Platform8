import { Store } from "vuex";
import { getModule } from "vuex-module-decorators";
import RegistrationModule from "./registrationModule";

let registrationModule: RegistrationModule;

function initializeModules(store: Store<any>): void {
  registrationModule = getModule(RegistrationModule, store);
}

export { initializeModules, registrationModule };
