// Loaded once per applicaiton. Required for dependency injection
import 'reflect-metadata';

import Vue, { PluginFunction, PluginObject } from "vue";
import { Store } from "vuex";
import router from "vue-router";
import VuexPersist from "vuex-persist";
import { getModule } from 'vuex-module-decorators';
import { extend } from 'vee-validate';

import { RouteNames } from "../router";

import { setupValidation } from '@platform8/vue2-common/src/validation';
import { NotificationPlugin } from "@platform8/vue2-notify/src";
import { FinancialAccountsPlugin } from "@platform8/vue2-financial-accounts/src";
import { UserPlugin } from "@platform8/vue2-user/src";
import userBootStrapper from "@platform8/vue2-user/src/boot-strapper";
import { RegistrationModule, UserModule } from '@platform8/vue2-user/src/store/store-modules';
import { NotificationState } from '@platform8/vue2-notify/src/store';
import { AccountsState } from '@platform8/vue2-financial-accounts/src/store';
import { UserState, RegistrationState } from '@platform8/vue2-user/src/store';
import { AuthStatus } from '@platform8/vue2-user/src/types';
import { TransactionsPlugin } from "@platform8/vue2-transactions/src";
import { BudgetPlugin } from "@platform8/vue2-budget-manager/src";

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
        LoginRedirectRouteName: RouteNames.Dashboard,
        DefaultRoute: RouteNames.Home,
      });

      vue.use(FinancialAccountsPlugin, {
        router: options.router,
        store: options.store,
        loadOnChangedGetter: () => (<UserState>options.store.state.User).authStatus,
        loadOnChangedValue: AuthStatus.LoggedIn
      });

      vue.use(TransactionsPlugin, {
        router: options.router,
        store: options.store
      });

      vue.use(BudgetPlugin, {
        router: options.router,
        store: options.store,
        loadOnChangedGetter: () => (<UserState>options.store.state.User).authStatus,
        loadOnChangedValue: AuthStatus.LoggedIn,
        onCloseRedirectRouteName: RouteNames.Dashboard
      })

      //TODO: Fix this. Move it into the UserPlugin install like FinancialAccountsPlugin
      userBootStrapper();

      //HACK: Calls to Vuex.registerModule inside plugins will wipe out the store getters.
      //      so we must call getModule for any module that got wiped out.
      //      https://github.com/vuejs/vuex/blob/d65d14276e87aca17cfbd3fbf4af9e8dbb808f24/src/store.js#L265
      //      https://github.com/championswimmer/vuex-module-decorators/issues/250
      //
      getModule(UserModule, options.store);
      getModule(RegistrationModule, options.store);

      setupValidation(extend);

      // router provided to add any plugin routes.
      // i.e. options.router.addRoutes(routes);

      const vuexLocalStorage = new VuexPersist({
        key: appName, // The key to store the state on in the storage provider.
        storage: window.localStorage, // or window.sessionStorage or localForage
        // Function that passes the state and returns the state with only the objects you want to store.
        reducer: (state: { Accounts: AccountsState, Notification: NotificationState, Registration: RegistrationState, User: UserState }) => ({
          // Accounts: {
          //   accounts: state.Accounts.accounts
          // },
          // Notification: state.Notification,
          // Registration: state.Registration,
          User: {
            authTokens: state.User.authTokens
          }
        }),
        // Function that passes a mutation and lets you decide if it should update the state in localStorage.
        // filter: (mutation) => true
      });

      vuexLocalStorage.plugin(options.store);
    }
  },
};

export default plugin as ClientPlugin;
