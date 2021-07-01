import Vue, { PluginFunction, PluginObject } from "vue";
import router from "vue-router";
import { Store } from "vuex";
import { initializeModules } from "./store";
import NotificationModule from "./store/notificationModule";
import { notificationModule } from './store';
export interface NotificationPlugin
  extends PluginObject<NotificationPluginOptions> {
  install: PluginFunction<NotificationPluginOptions>;
}

export interface NotificationPluginOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  store: Store<any>;
  router: router;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setupModules = (store: Store<any>): void => {
  store.registerModule("Notification", NotificationModule);
  initializeModules(store);
};

const notificationPlugin = {
  install(vue: typeof Vue, options?: NotificationPluginOptions) {
    if (options !== undefined && options.store && options.router) {
      setupModules(options.store);

      options.router.beforeEach((to, from, next) => {
        notificationModule.dismissAll();
        next();
      });
    }
  },
};

export default notificationPlugin as NotificationPlugin;
