// Loaded once per applicaiton. Required for dependency injection
import 'reflect-metadata';

import Vue, { PluginFunction, PluginObject } from "vue";
import { Store } from "vuex";
import router from "vue-router";
import VuexPersist from "vuex-persist";
import { setupValidation } from '@platform8/vue2-common/src/validation';
import { extend } from 'vee-validate';
import { NotificationPlugin } from "@platform8/vue2-notify/src";
import { UserPlugin } from "@platform8/vue2-user/src";
// import { initializeModules } from "../store";
import userBootStrapper from "@platform8/vue2-user/src/boot-strapper";

import "bootstrap/dist/css/bootstrap.css";
import "@platform8/web-ui/src/styles/styles.scss";

export interface ClientPlugin extends PluginObject<ClientPluginOptions> {
  install: PluginFunction<ClientPluginOptions>;
}

export interface ClientPluginOptions {
  appName: string;
  router: router;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  store: Store<any>;
}

const plugin = {
  install(vue: typeof Vue, options?: ClientPluginOptions) {
    if (options !== undefined && options.router && options.store) {
      const appName = options.appName ?? "Client";

      vue.use(NotificationPlugin, {
        router: options.router,
        store: options.store,
      });

      vue.use(UserPlugin, {
        router: options.router,
        store: options.store,
      })

      userBootStrapper();
      setupValidation(extend);

      // initializeModules(options.store);

      // option to add all components
      // Object.keys(components).forEach((name) => {
      //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
      //   Vue.component(name, (components as any)[name]);
      // });

      // router provided to add any plugin routes.
      // i.e. options.router.addRoutes(routes);

      const vuexLocalStorage = new VuexPersist({
        key: appName, // The key to store the state on in the storage provider.
        storage: window.localStorage, // or window.sessionStorage or localForage
        // Function that passes the state and returns the state with only the objects you want to store.
        // reducer: (state: { News: AppState }) => ({
        // }),
        // Function that passes a mutation and lets you decide if it should update the state in localStorage.
        // filter: (mutation) => true
      });

      vuexLocalStorage.plugin(options.store);
    }
  },
};

export default plugin as ClientPlugin;
