import 'reflect-metadata';

import { setupModules } from '@/plugin';
// import { setupModules as setupAccountsModules } from '@platform8/vue2-accounts/src/plugin';

import * as Components from "@/components";
import { Factory } from "../../../vue2-test-utils/src"
// import { testAccountsState, testTransactionsState } from "@/stories/data";

describe("ExpenseList.vue", () => {
  it("mounts", () => {

    // Arrange Act
    const component = Factory.create(Components.ExpensesList, (store) => {
      setupModules(store);
      // setupAccountsModules(store);
    });

    // Assert
    expect(component.isVueInstance).toBeTruthy();
  });

  it("shows list of expenses", () => {

    // Arrange & Act
    const component = Factory.create(Components.ExpensesList, (store) => {
      setupModules(store);
      // store.state.Accounts = testAccountsState;
      // store.state.Transactions = {
      //   transactions: testTransactionsState.transactions,
      //   actionText: 'Action'
      // };
    });
  });
});
