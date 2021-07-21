import { RouteConfig } from "vue-router";

export enum RouteNames {
  Budget = "Budget",
};

export const routes: Array<RouteConfig> = [
  {
    path: "/budget",
    name: RouteNames.Budget,
    component: () =>
      import("../components/Budget.vue"),
  },
];
