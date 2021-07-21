import Vue, { PluginFunction, PluginObject } from "vue";
import { Store } from "vuex";
import { initializeModules } from "./store";
import NotificationModule from "@platform8/vue2-notify/src/store/notificationModule";
import { NotificationPlugin } from "@platform8/vue2-notify/src/";
import { routes, RouteNames } from "./router";
import router from "vue-router";
import { getModule } from "vuex-module-decorators";
import { TransactionsModule } from "./store/transactionsModule";
import bootstrapper from "./bootstrapper";
import { AccountsState } from "@platform8/vue2-financial-accounts/src/store";
export interface TransactionsPlugin
  extends PluginObject<TransactionsPluginOptions> {
  install: PluginFunction<TransactionsPluginOptions>;
}

export interface TransactionsPluginOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  store: Store<any>;
  router: router;
  accountsGetter: () => any;
}

export const setupModules = (store: Store<any>): void => {
  
  store.registerModule("Transactions", TransactionsModule);
  initializeModules(store);
};

const TransactionsPlugin = {
  install(vue: typeof Vue, options?: TransactionsPluginOptions) {
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
        () => (<AccountsState>options.store.state.Accounts).accounts,
        (newValue) => {
          if (newValue.length > 0) {
            getModule(TransactionsModule, options.store).loadTransactions({
              accounts: newValue
            });
          }
        },
      );
    }
  },
};

export default TransactionsPlugin as TransactionsPlugin;
