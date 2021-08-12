import 'reflect-metadata';

import { setupModules } from '@/plugin';

import * as Components from "@/components";
import { Factory } from "../../../vue2-test-utils/src"

describe("AddAccount.vue", () => {
  it("mounts", () => {

    // Arrange & Act
    const component = Factory.create(Components.AddAccount, (store) => {
      setupModules(store);
    });

    // Assert
    expect(component.isVueInstance).toBeTruthy();
  });
});
