import 'reflect-metadata';

import { setupModules } from '@/plugin';

import * as Components from "@/components";
import { Factory } from "../../../vue2-test-utils/src"
import { testAccountsState as testState } from "@/stories/data";

describe("AccountList.vue", () => {
  it("mounts", () => {

    // Arrange & Act
    const component = Factory.create(Components.AccountList, (store) => {
      setupModules(store);
    });

    // Assert
    expect(component.isVueInstance).toBeTruthy();
  });

  it("shows list of accounts", () => {

    // Arrange & Act
    const component = Factory.create(Components.AccountList, (store) => {
      setupModules(store);
      store.state.Accounts = testState;
    });

    // Assert
    const accountList = component.find("#account-list");
    expect(accountList.element).toBeInstanceOf(HTMLElement);
    expect(accountList.element.children.length).toEqual(4);
  });

  it("shows list headers", () => {

    // Arrange & Act
    const component = Factory.create(Components.AccountList, (store) => {
      setupModules(store);
      store.state.Accounts = testState;
    });

    // Assert
    const accountList = component.find("#account-list");
    expect(accountList.element).toBeInstanceOf(HTMLElement);

    const headerRow = accountList.element.firstElementChild;
    expect(headerRow).toBeInstanceOf(HTMLElement);

    expect(headerRow?.children.length).toEqual(2);

    const headers = headerRow?.children as HTMLCollection;
    expect(headers[0].textContent).toEqual("Name");
    expect(headers[1].textContent).toEqual("Balance");

  });

  it("shows account details in list", () => {

    // Arrange & Act
    const component = Factory.create(Components.AccountList, (store) => {
      setupModules(store);
      store.state.Accounts = testState;
    });

    // Assert
    const accountList = component.find("#account-list");
    expect(accountList.element).toBeInstanceOf(HTMLElement);

    const accountDetailsRow = accountList.element.children[1];
    expect(accountDetailsRow).toBeInstanceOf(HTMLElement);
    expect(accountDetailsRow?.children.length).toEqual(2);

    const accountDetails = accountDetailsRow?.children as HTMLCollection;
    expect(accountDetails.length).toEqual(2);
    expect(accountDetails[0].textContent).toEqual(testState.accounts[0].name);
    expect(accountDetails[1].textContent?.trim()).toEqual(`$6,232.43`);
  });

  it("shows negative money amounts with a negative sign", () => {

    // Arrange & Act
    const component = Factory.create(Components.AccountList, (store) => {
      setupModules(store);
      store.state.Accounts = testState;
    });

    // Assert
    const accountList = component.find("#account-list");
    expect(accountList.element).toBeInstanceOf(HTMLElement);

    const accountDetailsRow = accountList.element.children[3];
    expect(accountDetailsRow).toBeInstanceOf(HTMLElement);
    expect(accountDetailsRow?.children.length).toEqual(2);

    const accountDetails = accountDetailsRow?.children as HTMLCollection;
    expect(accountDetails[1].textContent?.trim()).toEqual(`-$12,385.65`);
  });
});


