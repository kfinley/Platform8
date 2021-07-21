import Vue, { PluginFunction, PluginObject } from "vue";
import { Store } from "vuex";
import { initializeModules } from "./store";
import NotificationModule from "@platform8/vue2-notify/src/store/notificationModule";
import { NotificationPlugin } from "@platform8/vue2-notify/src/";
import { routes, RouteNames } from "./router";
import router from "vue-router";
import { getModule } from "vuex-module-decorators";
import bootstrapper from "./boot-strapper";
import { BudgetModule } from "./store/store-modules";

export interface BudgetManagementPlugin
  extends PluginObject<BudgetManagementPluginOptions> {
  install: PluginFunction<BudgetManagementPluginOptions>;
}

export interface BudgetManagementPluginOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  store: Store<any>;
  router: router;
}

export const setupModules = (store: Store<any>): void => {
  store.registerModule("Budget", BudgetModule);
  initializeModules(store);
}

const BudgetManagementPlugin = {
  install(vue: typeof Vue, options?: BudgetManagementPluginOptions) {
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

    }
  },
};

export default BudgetManagementPlugin as BudgetManagementPlugin;
