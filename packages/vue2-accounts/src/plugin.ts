import Vue, { PluginFunction, PluginObject } from "vue";
import { Store } from "vuex";
import { initializeModules } from "./store";
import NotificationModule from "@platform8/vue2-notify/src/store/notificationModule";
import { NotificationPlugin } from "@platform8/vue2-notify/src/";
import { routes, RouteNames } from "./router";
import router from "vue-router";
import { getModule } from "vuex-module-decorators";
import bootstrapper from "./boot-strapper";
import { AccountsModule } from "./store/store-modules";

export interface AccountsPlugin
  extends PluginObject<AccountsPluginOptions> {
  install: PluginFunction<AccountsPluginOptions>;
}

export interface AccountsPluginOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  store: Store<any>;
  router: router;
  loadOnChangedValue: any;
  loadOnChangedGetter: () => any;
}

export const setupModules = (store: Store<any>): void => {
  store.registerModule("Accounts", AccountsModule);
  initializeModules(store);
}

const AccountsPlugin = {
  install(vue: typeof Vue, options?: AccountsPluginOptions) {
    if (options !== undefined && options.store && options.router) {

      bootstrapper();

      setupModules(options.store);

      if (getModule(NotificationModule, options.store) === undefined) {
        vue.use(NotificationPlugin, {
          router: options.router,
          store: options.store,
        });
      }
      options.router.addRoutes(routes);

      options.store.watch(
        options.loadOnChangedGetter,
        (newValue) => {

          if (newValue === options.loadOnChangedValue) {
            getModule(AccountsModule, options.store).loadAccounts({});
          }
        },
      );
    }
  },
};

export default AccountsPlugin as AccountsPlugin;
