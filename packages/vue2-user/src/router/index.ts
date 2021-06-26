import { RouteConfig } from "vue-router";

export const routes: Array<RouteConfig> = [
  {
    path: "/register",
    name: "Register",
    component: () =>
      import("../components/Register.vue"),
  }
];
