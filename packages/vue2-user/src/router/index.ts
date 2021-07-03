import { RouteConfig } from "vue-router";

export enum RouteNames {
  Register = "Register",
  Login = "Login",
  SetPassword = "SetPassword",
};

export const routes: Array<RouteConfig> = [
  {
    path: "/register",
    name: RouteNames.Register,
    meta: { allowAnonymous: true },
    component: () =>
      import("../components/Register.vue"),
  },
  {
    path: "/login",
    name: RouteNames.Login,
    meta: { allowAnonymous: true },
    component: () =>
      import("../components/Login.vue"),
  },
  {
    path: "/set-password",
    name: RouteNames.SetPassword,
    meta: { allowAnonymous: true },
    component: () =>
      import("../components/SetPassword.vue"),
      props(route) {
        return route.query || { }
      }
  }
];
