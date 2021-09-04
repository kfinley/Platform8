import Vue, { PluginFunction, PluginObject } from "vue";
import { Store } from "vuex";
import { expensesModule, initializeModules } from "./store";
import NotificationModule from "@platform8/vue2-notify/src/store/notificationModule";
import { NotificationPlugin } from "@platform8/vue2-notify/src/";
import { routes } from "./router";
import router from "vue-router";
import { getModule } from "vuex-module-decorators";
import bootstrapper from "./bootstrapper";
import { ExpensesModule } from "./store/expensesModule";
// import { expensesModule } from "./store";
import * as components from "./components";

export interface ExpensesPlugin
  extends PluginObject<ExpensesPluginOptions> {
  install: PluginFunction<ExpensesPluginOptions>;
}

export interface ExpensesPluginOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  store: Store<any>;
  router: router;
  loadOnChangedValue: any;
  loadOnChangedGetter: () => any;
  onCloseRedirectRouteName: string;
}

export const setupModules = (store: Store<any>): void => {
  store.registerModule("Expenses", ExpensesModule);
  initializeModules(store);
}

const ExpensesPlugin = {
  install(vue: typeof Vue, options?: ExpensesPluginOptions) {
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

      Object.keys(components).forEach(name => {
        Vue.component(name, (<any>components)[name]);
      });

      expensesModule.settings = {
        onCloseRedirectRouteName: options.onCloseRedirectRouteName
      };

      options.store.watch(
        options.loadOnChangedGetter,
        (newValue) => {
          if (newValue === options.loadOnChangedValue) {
            expensesModule.loadExpenses();
          }
        },
      );
    }
  },
};

export default ExpensesPlugin as ExpensesPlugin;
