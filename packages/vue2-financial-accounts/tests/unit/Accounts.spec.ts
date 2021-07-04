import 'reflect-metadata'; // <-- deal with this...

import { initializeModules } from '@/store';

import Components from "@/components";
import { Factory } from "../../../vue2-test-utils/src"

export const testState = {
  accounts: [ {
    name: "Bank Checking",
    balance: 6232.43
  },
  {
    name: "Bank Savings",
    balance: 23456.43
  }]
};

describe("Accounts.vue", () => {
  it("mounts", () => {

    // Arrange & Act
    const component = Factory.create(Components.Accounts, (store) => {
      initializeModules(store);
    });

    // Assert
    expect(component.isVueInstance).toBeTruthy();
  });

  it("shows list of accounts", () => {

    // Arrange & Act
    const component = Factory.create(Components.Accounts, (store) => {
      initializeModules(store);
      store.state.Accounts = testState;
    });

    // Assert
    const accountList = component.find("#account-list");
    expect(accountList.element).toBeInstanceOf(HTMLElement);
    expect(accountList.element.children.length).toEqual(3);
  });

  it("shows list headers", () => {

    // Arrange & Act
    const component = Factory.create(Components.Accounts, (store) => {
      initializeModules(store);
      store.state.Accounts = testState;
    });

    // Assert
    const accountList = component.find("#account-list");
    expect(accountList.element).toBeInstanceOf(HTMLElement);

    const headerRow = accountList.element.firstElementChild;
    expect(headerRow).toBeInstanceOf(HTMLElement);

    expect(headerRow?.children.length).toEqual(2);

    const headers = headerRow?.children as HTMLCollection;
    expect(headers[0].textContent).toEqual("Account Name");
    expect(headers[1].textContent).toEqual("Balance");

  });

  it("shows account details in list", () => {

    // Arrange & Act
    const component = Factory.create(Components.Accounts, (store) => {
      initializeModules(store);
      store.state.Accounts = testState;
    });

    // Assert
    const accountList = component.find("#account-list");
    expect(accountList.element).toBeInstanceOf(HTMLElement);

    const accountDetailsRow = accountList.element.children[1];
    expect(accountDetailsRow).toBeInstanceOf(HTMLElement);

    expect(accountDetailsRow?.children.length).toEqual(2);
    const accountDetails = accountDetailsRow?.children as HTMLCollection;

    expect(accountDetails[0].textContent).toEqual(testState.accounts[0].name);
    expect(accountDetails[1].textContent).toEqual(testState.accounts[0].balance.toString());
  });
});


