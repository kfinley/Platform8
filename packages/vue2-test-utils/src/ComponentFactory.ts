/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Vue from "vue";
import Vuex, { Store } from "vuex";
import { createLocalVue, mount, VueClass, RouterLinkStub } from "@vue/test-utils";

export function create(
  Component: VueClass<Vue>,
  configureStore?: (store: any) => void,
  propsData?: any,
  store?: Store<unknown>,
) {

  const localVue = createLocalVue();
  localVue.use(Vuex);

  store = store ?? new Vuex.Store({});

  store.dispatch = jest.fn();
  store.commit = jest.fn();

  configureStore?.(store);

  const comp = mount(Component, {
    propsData,
    store,
    stubs: {
      RouterLink: RouterLinkStub
    },
    localVue,
  });

  return comp;
}

export async function createWithData(
  Component: VueClass<Vue>,
  data: any,
  propsData?: any,
  store?: Store<unknown>,
) {

  const comp = create(Component, propsData, store);

  await comp.setData(data);
  await comp.vm.$nextTick();

  return comp;
}

