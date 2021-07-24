import 'reflect-metadata'; // <-- deal with this...

import { setupModules } from '@/plugin';
import { setupModules as setupAccountsModules } from '@platform8/vue2-accounts/src/plugin';

import * as Components from "@/components";
import { Factory } from "../../../vue2-test-utils/src"
import { testAccountsState } from '@/stories/data';

describe("UploadTransactions.vue", () => {
  it("mounts", () => {

    // Arrange Act
    const component = Factory.create(Components.UploadTransactions, (store) => {
      setupModules(store);
      setupAccountsModules(store);
      store.state.Accounts = testAccountsState;
    }, {
      accounts: testAccountsState.accounts
    });

    // Assert
    expect(component.isVueInstance).toBeTruthy();
  });
});
