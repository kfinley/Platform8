import 'reflect-metadata'; // <-- deal with this...

import { initializeModules } from '@/store';

import Components from "@/components";
import { Factory } from "../../../vue2-test-utils/src"

describe("Accounts.vue", () => {
  it("mounts", () => {

    // Arrange Act
    const component = Factory.create(Components.Accounts, (store) => {
      initializeModules(store);
    });

    // Assert
    expect(component.isVueInstance).toBeTruthy();
  });
});

