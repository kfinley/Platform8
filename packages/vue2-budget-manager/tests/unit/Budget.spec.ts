import 'reflect-metadata';

import { setupModules } from '@/plugin';

import { Budget } from "@/components";
import { Factory } from "../../../vue2-test-utils/src"

describe("Budget.vue", () => {
  it("mounts", () => {

    // Arrange & Act
    const component = Factory.create(Budget, (store) => {
      setupModules(store);
    });

    // Assert
    expect(component.isVueInstance).toBeTruthy();
  });

});
