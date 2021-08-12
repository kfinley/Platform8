import 'reflect-metadata';

import { setupModules } from '@/plugin';
import { setupModules as setupAccountsModules } from '@platform8/vue2-accounts/src/plugin';

import * as Components from "@/components";
import { Factory } from "../../../vue2-test-utils/src"
import { testAccountsState, testTransactionsState } from "@/stories/data";

describe("TransactionList.vue", () => {
  it("mounts", () => {

    // Arrange Act
    const component = Factory.create(Components.TransactionList, (store) => {
      setupModules(store);
      setupAccountsModules(store);
    });

    // Assert
    expect(component.isVueInstance).toBeTruthy();
  });

  it("shows list of transactions", () => {

    // Arrange & Act
    const component = Factory.create(Components.TransactionList, (store) => {
      setupModules(store);
      store.state.Accounts = testAccountsState;
      store.state.Transactions = {
        transactions: testTransactionsState.transactions,
        actionText: 'Action'
      };
    });



  });

  it("shows action as a button", () => {

    // Arrange & Act
    const component = Factory.create(Components.TransactionList, (store) => {
      setupModules(store);
      store.state.Accounts = testAccountsState;
      store.state.Transactions = testTransactionsState;
    });

    // Assert
    const accountList = component.find(".transaction-action-container");
    expect(accountList.element).toBeInstanceOf(HTMLElement);


  })
});
