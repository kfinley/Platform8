import Vue, { PluginFunction, PluginObject } from 'vue';
import { Module, Store } from 'vuex';
// import { initializeModules } from '../store';
import NotificationModule from '../store/notificationModule';

export interface NotificationPlugin extends PluginObject<NotificationPluginOptions> {
  install: PluginFunction<NotificationPluginOptions>;
}

export interface NotificationPluginOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  store: Store<any>;
}

export const setupModules = (store: Store<any>): void => {
  store.registerModule('Notification', NotificationModule);
  // initializeModules(store);
};

const notificationPlugin = {
  install(vue: typeof Vue, options?: NotificationPluginOptions) {
    if (options !== undefined && options.store) {
      setupModules(options.store);
    }
  }
}

export default notificationPlugin as NotificationPlugin;

