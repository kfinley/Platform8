import 'reflect-metadata'; // <-- deal with this...

import { setupModules } from '@/plugin';

import * as Components from "@/components";
import { Factory } from "../../../vue2-test-utils/src"

describe("Budget.vue", () => {
  it("mounts", () => {

    // Arrange & Act
    const component = Factory.create(Components.Budget, (store) => {
      setupModules(store);
    });

    // Assert
    expect(component.isVueInstance).toBeTruthy();
  });

});
