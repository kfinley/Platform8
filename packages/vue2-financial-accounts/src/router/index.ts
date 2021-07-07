import { RouteConfig } from "vue-router";

export enum RouteNames {
  Accounts = "Accounts",
};

export const routes: Array<RouteConfig> = [
  {
    path: "/accounts",
    name: RouteNames.Accounts,
    component: () =>
      import("../components/Accounts.vue"),
  },
];
