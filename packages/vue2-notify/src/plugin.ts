import Vue, { PluginFunction, PluginObject } from "vue";
import { Store } from "vuex";
import { initializeModules } from "./store";
import NotificationModule from "./store/notificationModule";
// import * as components from "./components";

export interface NotificationPlugin
  extends PluginObject<NotificationPluginOptions> {
  install: PluginFunction<NotificationPluginOptions>;
}

export interface NotificationPluginOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  store: Store<any>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setupModules = (store: Store<any>): void => {
  store.registerModule("Notification", NotificationModule);
  initializeModules(store);
};

const notificationPlugin = {
  install(vue: typeof Vue, options?: NotificationPluginOptions) {
    if (options !== undefined && options.store) {
      setupModules(options.store);

      // Object.keys(components).forEach((name) => {
      //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
      //   console.log(`registering ${name}`);
      //   vue.component(name, (components as any)[name]);
      // });
    }
  },
};

export default notificationPlugin as NotificationPlugin;
