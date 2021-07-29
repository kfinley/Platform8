import 'reflect-metadata'; // <-- deal with this...

import { setupModules } from '@/plugin';

import { CategoryList } from "@/components";
import { Factory } from "../../../vue2-test-utils/src"
import { testCategories } from './data';

describe("CategoryList.vue", () => {

  let component: any;

  beforeAll(() => {
    // Arrange & Act
    component = Factory.create(CategoryList, (store) => {
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

  it("should show a list of Categories", () => {
    // Assert
    const categoryList = component.find("#category-list");
    expect(categoryList.element).toBeInstanceOf(HTMLElement);
    expect(categoryList.element.children.length).toEqual(5);
  });

  it("should show Category name", () => {

    // Assert
    const categoryList = component.find(`#category-list>li>div>div`);
    expect(categoryList.element).toBeInstanceOf(HTMLElement);
    expect(categoryList.element.textContent?.trim()).toEqual('Housing');

  })

  it("should show Category allocations", () => {

    // Assert
    const categoryList = component.find(`#category-list>li>div>div+div`);
    expect(categoryList.element).toBeInstanceOf(HTMLElement);
    expect(categoryList.element.textContent?.trim()).toEqual('25-35%');
  });

  it("should show a list of Category Classifications", () => {

    // Assert
    const categoryList = component.find('#classification-list-' + testCategories[0].id);
    expect(categoryList.element).toBeInstanceOf(HTMLElement);
    expect(categoryList.element.children.length).toEqual(3);

  });

});
