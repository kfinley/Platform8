import { Store } from "vuex";
import { getModule } from "vuex-module-decorators";
import NotificationModule from "./notificationModule";

let notificationModule: NotificationModule;

function initializeModules(store: Store<any>): void {
  notificationModule = getModule(NotificationModule, store);
}

export { initializeModules, notificationModule };
