import 'reflect-metadata'; // <-- deal with this...

import { setupModules } from '@/plugin';

import * as Components from "@/components";
import { Factory } from "../../../vue2-test-utils/src"
import { testCategories } from './data';

describe("AddCategory.vue", () => {

  let component: any;

  beforeAll(() => {
    // Arrange & Act
    component = Factory.create(Components.AddCategory, (store) => {
      setupModules(store);
      store.state.Budget.budget = {
        id: "123",
        categories: testCategories
      }
    });
  });

  it("mounts", () => {
    // Assert
    expect(component.isVueInstance).toBeTruthy();
  });

});
