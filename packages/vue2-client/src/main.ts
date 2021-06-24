import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import ClientPlugin from "./plugins/client";
import router from "./router";
import { store } from "./store";
import "bootstrap/dist/css/bootstrap.css";

Vue.config.productionTip = false;

Vue.use(ClientPlugin, {
  router,
  store,
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");

// new Vue({
//   el: "#app",
//   store,
//   template: "</App/>",
//   components: { App },
//   router,
// });
