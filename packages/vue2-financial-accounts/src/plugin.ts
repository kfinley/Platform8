import Vue, { PluginFunction, PluginObject } from "vue";
import { Store } from "vuex";
import { initializeModules } from "./store";
import NotificationModule from "@platform8/vue2-notify/src/store/notificationModule";
import { NotificationPlugin } from "@platform8/vue2-notify/src/";
import { routes, RouteNames } from "./router";
import router from "vue-router";
import { getModule } from "vuex-module-decorators";
import bootstrapper from "./boot-strapper";

export interface FinancialAccountsPlugin
  extends PluginObject<FinancialAccountsPluginOptions> {
  install: PluginFunction<FinancialAccountsPluginOptions>;
}

export interface FinancialAccountsPluginOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  store: Store<any>;
  router: router;
}

const FinancialAccountsPlugin = {
  install(vue: typeof Vue, options?: FinancialAccountsPluginOptions) {
    if (options !== undefined && options.store && options.router) {
      bootstrapper();
      initializeModules(options.store);

      if (getModule(NotificationModule, options.store) === undefined) {
        vue.use(NotificationPlugin, {
          router: options.router,
          store: options.store,
        });
      }
      options.router.addRoutes(routes);

    }
  },
};

export default FinancialAccountsPlugin as FinancialAccountsPlugin;
