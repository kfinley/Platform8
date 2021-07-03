import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";
import Secured from "../views/Secured.vue";

Vue.use(VueRouter);

export enum RouteNames {
  Home = "Home",
  About = "About",
  Secured = "Secured",
};

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: RouteNames.Home,
    component: Home,
    meta: { allowAnonymous: true },
  },
  {
    path: "/secured",
    name: RouteNames.Secured,
    component: Secured,
  },
  {
    path: "/about",
    name: RouteNames.About,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import("../views/About.vue"),
    meta: { allowAnonymous: true },
  },
];

const router = new VueRouter({
  mode: "history",
  base: "/", // process.env.BASE_URL,
  routes,
});

export default router;
