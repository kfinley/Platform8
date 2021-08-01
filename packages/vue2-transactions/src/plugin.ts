import Vue, { PluginFunction, PluginObject } from "vue";
import { Store } from "vuex";
import { initializeModules } from "./store";
import NotificationModule from "@platform8/vue2-notify/src/store/notificationModule";
import { NotificationPlugin } from "@platform8/vue2-notify/src/";
import { routes } from "./router";
import router from "vue-router";
import { getModule } from "vuex-module-decorators";
import { TransactionsModule } from "./store/transactionsModule";
import bootstrapper from "./bootstrapper";
import { TransactionsState } from "./store";
import { TransactionStatus } from "./models";

export interface TransactionsPlugin
  extends PluginObject<TransactionsPluginOptions> {
  install: PluginFunction<TransactionsPluginOptions>;
}

export interface TransactionsPluginOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  store: Store<any>;
  router: router;
  loadOnChangedGetter: () => any;
  actionText: string;
  actionComponent: string;
  actionFunction: string,
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

      (<TransactionsState>options.store.state.Transactions).actionFunction = options.actionFunction;      
      (<TransactionsState>options.store.state.Transactions).actionText = options.actionText;
      (<TransactionsState>options.store.state.Transactions).actionComponent = options.actionComponent;

      options.store.watch(
        options.loadOnChangedGetter,
        (newValue) => {
          if (newValue.length > 0) {
            getModule(TransactionsModule, options.store).loadTransactions({
              status: TransactionStatus.Unreviewed,
              accounts: newValue
            });
          }
        },
      );
    }
  },
};

export default TransactionsPlugin as TransactionsPlugin;
