import Vue, { PluginFunction, PluginObject } from "vue";
import { Store } from "vuex";
import { initializeModules } from "./store";
import NotificationModule from "@platform8/vue2-notify/src/store/notificationModule";
import { NotificationPlugin } from "@platform8/vue2-notify/src/";
import router from "vue-router";
import { getModule } from "vuex-module-decorators";
import bootstrapper from "./bootstrapper";
import { WebSocketsModule } from "./store/webSocketsModule";

export interface WebSocketsPlugin
  extends PluginObject<WebSocketsPluginOptions> {
  install: PluginFunction<WebSocketsPluginOptions>;
}

export interface WebSocketsPluginOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  store: Store<any>;
  router: router;
}

export const setupModules = (store: Store<any>): void => {
  store.registerModule("WebSockets", WebSocketsModule);
  initializeModules(store);
}

const WebSocketsPlugin = {
  install(vue: typeof Vue, options?: WebSocketsPluginOptions) {
    if (options !== undefined && options.store) {

      bootstrapper();

      setupModules(options.store);

      if (getModule(NotificationModule, options.store) === undefined) {
        vue.use(NotificationPlugin, {
          router: options.router,
          store: options.store,
        });
      }
    }
  },
};

export default WebSocketsPlugin as WebSocketsPlugin;
