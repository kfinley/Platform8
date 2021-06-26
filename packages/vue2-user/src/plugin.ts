import Vue, { PluginFunction, PluginObject } from "vue";
import { Store } from "vuex";
import { initializeModules } from "./store";
import RegistrationModule from "./store/registrationModule";

import NotificationModule from "@platform8/vue2-notify/src/store/notificationModule";
import { routes } from "./router";
import router from "vue-router";
import { getModule } from "vuex-module-decorators";

export interface UserPlugin
  extends PluginObject<UserPluginOptions> {
  install: PluginFunction<UserPluginOptions>;
}

export interface UserPluginOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  store: Store<any>;
  router: router;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setupModules = (store: Store<any>): void => {
  store.registerModule("Registration", RegistrationModule);
  initializeModules(store);
};

const UserPlugin = {
  install(vue: typeof Vue, options?: UserPluginOptions) {
    if (options !== undefined && options.store && options.router) {
      setupModules(options.store);

      if (getModule(NotificationModule, options.store) === undefined) {
        vue.use(UserPlugin, {
          router: options.router,
          store: options.store,
        });
      }
      options.router.addRoutes(routes);
    }
  },
};

export default UserPlugin as UserPlugin;
