import Vue, { PluginFunction, PluginObject } from "vue";
import { Store } from "vuex";
import { initializeModules, UserState, AuthStatus } from "./store";
import { RegistrationModule, UserModule } from "./store/store-modules";
import { userModule } from "./store";
import NotificationModule from "@platform8/vue2-notify/src/store/notificationModule";
import { NotificationPlugin } from "@platform8/vue2-notify/src/";
import { routes, RouteNames } from "./router";
import router from "vue-router";
import { getModule } from "vuex-module-decorators";
import { authHelper } from "@platform8/api-client/src/helpers";
import bootstrapper from "./bootstrapper";

export interface UserPlugin
  extends PluginObject<UserPluginOptions> {
  install: PluginFunction<UserPluginOptions>;
}

export interface UserPluginOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  store: Store<any>;
  router: router;
  DefaultRoute: string;
  LoginRedirectRouteName: string;
  postAuthFunction: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setupModules = (store: Store<any>): void => {
  store.registerModule("Registration", RegistrationModule);
  store.registerModule("User", UserModule);

  initializeModules(store);
};

const UserPlugin = {
  install(vue: typeof Vue, options?: UserPluginOptions) {
    if (options !== undefined && options.store && options.router) {

      bootstrapper();

      setupModules(options.store);

      if (getModule(NotificationModule, options.store) === undefined) {
        vue.use(NotificationPlugin, {
          router: options.router,
          store: options.store,
        });
      }
      userModule.mutate((state: UserState) => state.postAuthFunction = options.postAuthFunction);

      options.router.addRoutes(routes);

      options.router.beforeEach(async (to, from, next) => {

        await (options.store as any).restored;
        if ((options.store.state.User as UserState).authTokens) {
          userModule
            .mutate((s) => {
              s.authStatus = AuthStatus.LoggedIn;
            });

          //TODO: deal with this stuff....
          authHelper.authToken = () => {
            return (options.store.state.User as UserState).authTokens?.accessToken as string;
          };
          authHelper.refreshToken = () => {
            return (options.store.state.User as UserState).authTokens?.refreshToken as string;
          };
          authHelper.username = () => {
            return (options.store.state.User as UserState).currentUser?.username as string;
          }
        }

        const authStatus = (<UserState>options.store.state.User).authStatus;

        if (to.meta?.allowAnonymous) {
          if (
            authStatus === AuthStatus.LoggedIn
            && to.name === RouteNames.Login
          ) {
            next('/');
          } else {
            next();
          }
          return;
        }

        switch (authStatus) {
          case AuthStatus.LoggingIn:
          case AuthStatus.LoginFailed:
            next({ name: RouteNames.Login });
            return;
          case AuthStatus.Registering:
            next({ name: RouteNames.Register });
            return;
          case AuthStatus.LoggedIn:
            if (to.name === RouteNames.Login) {
              next({ name: options.LoginRedirectRouteName });
              return;
            }
            next();
            return;
          case AuthStatus.LoggedOut:
            if (to.name === RouteNames.Login) {
              next();
              return;
            }
            next({ name: options.DefaultRoute });
            return;
          default:
            next({ name: options.DefaultRoute });
        }
      });

      options.store.watch(
        () => (<UserState>options.store.state.User).authStatus,
        (newValue) => {
          if (options.router.currentRoute.name === null) {
            return;
          }

          switch (newValue) {
            case AuthStatus.LoggedIn:
              if (options.router.currentRoute.name !== options.LoginRedirectRouteName) {
                options.router.push({ name: options.LoginRedirectRouteName });
              }
              break;
            case AuthStatus.LoggingIn:
            case AuthStatus.LoginFailed:
              if (options.router.currentRoute.name === RouteNames.Login ||
                options.router.currentRoute.name === RouteNames.SetPassword) {
                return;
              }
              options.router.push({ name: RouteNames.Login });
              break;
            case AuthStatus.NewPasswordRequired:
            case AuthStatus.SettingPassword:
              if (options.router.currentRoute.name === RouteNames.SetPassword) {
                return;
              }
              options.router.push({ name: RouteNames.SetPassword });
              break;
            case AuthStatus.Registering:
              if (options.router.currentRoute.name === RouteNames.Register) {
                return;
              }
              options.router.push({ name: RouteNames.Register });
              break;
            default:
              options.router.push({ name: RouteNames.Login });
              break;
          }
        },
      );
    }
  },
};

export default UserPlugin as UserPlugin;
