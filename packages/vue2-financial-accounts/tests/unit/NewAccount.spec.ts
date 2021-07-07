import 'reflect-metadata'; // <-- deal with this...

import { initializeModules } from '@/store';

import * as Components from "@/components";
import { Factory } from "../../../vue2-test-utils/src"

describe("AddAccount.vue", () => {
  it("mounts", () => {

    // Arrange & Act
    const component = Factory.create(Components.AddAccount, (store) => {
      initializeModules(store);
    });

    // Assert
    expect(component.isVueInstance).toBeTruthy();
  });
});
