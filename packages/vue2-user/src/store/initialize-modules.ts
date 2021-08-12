import { Store } from "vuex";
import { getModule } from "vuex-module-decorators";
import { RegistrationModule, UserModule }  from "./store-modules";

let registrationModule: RegistrationModule;
let userModule: UserModule;

export function initializeModules(store: Store<any>): void {
  registrationModule = getModule(RegistrationModule, store);
  userModule = getModule(UserModule, store);
}

export { registrationModule, userModule };
