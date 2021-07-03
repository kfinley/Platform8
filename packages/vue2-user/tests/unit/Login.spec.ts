import 'reflect-metadata'; // <-- deal with this...

import { setupModules } from '@/plugin';
import { setupModules as setupNotificationModule } from "@platform8/vue2-notify/src/plugin";

import Components from "@/components";
import { Factory } from "../../../vue2-test-utils/src"

describe("Login.vue", () => {
  it("mounts", () => {

    // Arrange
    const component = Factory.create(Components.Login, (store) => {
      setupNotificationModule(store);
      setupModules(store);
    });

    // Assert
    expect(component.isVueInstance).toBeTruthy();
  });
});


