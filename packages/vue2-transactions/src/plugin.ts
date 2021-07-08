import Vue, { PluginFunction, PluginObject } from "vue";
import { Store } from "vuex";
import { initializeModules } from "./store";
import NotificationModule from "@platform8/vue2-notify/src/store/notificationModule";
import { NotificationPlugin } from "@platform8/vue2-notify/src/";
import { routes, RouteNames } from "./router";
import router from "vue-router";
import { getModule } from "vuex-module-decorators";

export interface TransactionsPlugin
  extends PluginObject<TransactionsPluginOptions> {
  install: PluginFunction<TransactionsPluginOptions>;
}

export interface TransactionsPluginOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  store: Store<any>;
  router: router;
}

const TransactionsPlugin = {
  install(vue: typeof Vue, options?: TransactionsPluginOptions) {
    if (options !== undefined && options.store && options.router) {
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

export default TransactionsPlugin as TransactionsPlugin;
