import 'reflect-metadata'; // <-- deal with this...

import { setupModules } from '@/plugin';

import * as Components from "@/components";
import { Factory } from "../../../vue2-test-utils/src"

describe("UploadTransactions.vue", () => {
  it("mounts", () => {

    // Arrange Act
    const component = Factory.create(Components.UploadTransactions, (store) => {
      setupModules(store);
    });

    // Assert
    expect(component.isVueInstance).toBeTruthy();
  });
});
