declare module "*.vue" {
  import Vue from "vue";
  import VueRouter, { Route } from 'vue-router';
  declare module 'vue/types/vue' {
    interface Vue {
      $router: VueRouter;
      $route: Route;
    }
  }

  export default Vue;
}


