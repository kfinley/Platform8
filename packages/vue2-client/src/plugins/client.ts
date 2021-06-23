import Vue, { PluginFunction, PluginObject } from "vue";
import { Store } from "vuex";
import router from "vue-router";
import VuexPersist from "vuex-persist";
import NotificationPlugin from "./notification";
import { initializeModules } from "../store";

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

      Vue.use(NotificationPlugin, {
        router: options.router,
        store: options.store,
      });

      initializeModules(options.store);

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
