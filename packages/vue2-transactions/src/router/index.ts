import { RouteConfig } from "vue-router";

export enum RouteNames {
  Transactions = "Transactions",
};

export const routes: Array<RouteConfig> = [
  {
    path: "/transactions",
    name: RouteNames.Transactions,
    component: () =>
      import("../components/UploadTransactions.vue"),
  },
];
