import Vue, { PluginFunction, PluginObject } from "vue";
import { Store } from "vuex";
import { initializeModules } from "./store";
import NotificationModule from "@platform8/vue2-notify/src/store/notificationModule";
import { NotificationPlugin } from "@platform8/vue2-notify/src/";
import { routes, RouteNames } from "./router";
import router from "vue-router";
import { getModule } from "vuex-module-decorators";
import bootstrapper from "./bootstrapper";
import { BudgetModule } from "./store/store-modules";
import { budgetModule } from "./store";
import { CategoryComponent } from "./components";

export interface BudgetManagementPlugin
  extends PluginObject<BudgetManagementPluginOptions> {
  install: PluginFunction<BudgetManagementPluginOptions>;
}

export interface BudgetManagementPluginOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  store: Store<any>;
  router: router;
  loadOnChangedValue: any;
  loadOnChangedGetter: () => any;
  onCloseRedirectRouteName: string;
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

      Vue.component("Category", CategoryComponent);

      budgetModule.settings = {
        onCloseRedirectRouteName: options.onCloseRedirectRouteName
      };

      options.store.watch(
        options.loadOnChangedGetter,
        (newValue) => {
          if (newValue === options.loadOnChangedValue) {
            budgetModule.loadBudget();
          }
        },
      );
    }
  },
};

export default BudgetManagementPlugin as BudgetManagementPlugin;
