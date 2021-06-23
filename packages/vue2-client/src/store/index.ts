import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {},
});

import { Store } from 'vuex';
import { initializeModules } from './store-accessor';

const initializer = (store: Store<any>) => initializeModules(store);

export const storeInitializer = [initializer];
export * from './store-accessor';
export * from './state'
