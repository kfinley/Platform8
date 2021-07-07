import 'reflect-metadata'; // <-- deal with this...
import Vuex from "vuex";
import { createLocalVue } from "@vue/test-utils";
import { AddAccountRequest } from "@/models";
import { AccountsState, AccountsStatus, initializeModules } from "@/store";
import { initializeModules as notificationInitializeModules } from "@platform8/vue2-notify/src/store";
import { AddAccountCommand } from "@/commands";
import bootstrapper from "@/boot-strapper";

export const storeFactory = (commit?: any) => {
  const localVue = createLocalVue();
  localVue.use(Vuex);

  const store = new Vuex.Store({});

  initializeModules(store);
  notificationInitializeModules(store);

  if (commit !== undefined) {
    store.commit = commit;
  }

  return store;
};

const testAccount: AddAccountRequest = {
  name: "Checking",
  financialInstitution: "First Financial",
  accountType: "Checking",
  startingBalance: 25934.32
};

describe("AccountsModule.AddAccount - Success", () => {

  const commit = jest.fn();
  const addAccountRunAsyncMock = jest.fn();

  beforeAll(async () => {

    // Arrange
    const store = storeFactory(commit);

    AddAccountCommand.prototype.runAsync = addAccountRunAsyncMock;
    addAccountRunAsyncMock.mockReturnValue(Promise.resolve({
      success: true
    }));

    bootstrapper();

    // Act
    await store.dispatch("Accounts/addAccount", testAccount);

  });

  it("should run", () => {
    expect(commit);
  });

  it("should set the accountsStatus to Saving", () => {

    // Assert
    // check that mutate was the second call to commit
    expect(commit).toHaveBeenNthCalledWith(2,
      "Accounts/mutate",
      expect.any(Function),
      undefined
    );

    // Check that the function passed to mutate is correct.
    expect(commit.mock.calls[1][1].toString()).toBe('state => state.accountsStatus = _state.AccountsStatus.Saving')

  });

  it("should run AddAccountCommand", () => {

    // Assert
    expect(addAccountRunAsyncMock).toHaveBeenCalledWith(testAccount);

  });

  it("should save the new account in the Accounts store", () => {

    // Assert
    // check that mutate was the second call to commit
    expect(commit).toHaveBeenNthCalledWith(3,
      "Accounts/mutate",
      expect.any(Function),
      undefined
    );
    expect(commit.mock.calls[2][1].toString()).toContain("state.accounts.push(");

  });

  it("should set accountsStatus to Loaded", () => {

    // Assert
    // check that mutate was the second call to commit
    expect(commit).toHaveBeenNthCalledWith(3,
      "Accounts/mutate",
      expect.any(Function),
      undefined
    );
    expect(commit.mock.calls[2][1].toString()).toContain("state.accountsStatus = _state.AccountsStatus.Loaded");

  });

});

describe("AccountsModule.AddAccount - Fail", () => {

  const commit = jest.fn();
  const addAccountRunAsyncMock = jest.fn();

  beforeAll(async () => {

    // Arrange
    const store = storeFactory(commit);

    AddAccountCommand.prototype.runAsync = addAccountRunAsyncMock;
    addAccountRunAsyncMock.mockReturnValue(Promise.resolve({
      success: false,
      error: 'Error thrown for testing'
    }));

    bootstrapper();

    // Act
    await store.dispatch("Accounts/addAccount", testAccount);
  });

  it("should set accountsStatus to Failed on fail", () => {
    // Assert
    // check that mutate was the second call to commit
    expect(commit).toHaveBeenNthCalledWith(3,
      "Accounts/mutate",
      expect.any(Function),
      undefined
    );
    expect(commit.mock.calls[2][1].toString()).toContain("state.accountsStatus = _state.AccountsStatus.Failed");

  });

  it("should call notificationModule.handleError on fail", () => {
    // Assert
    expect(commit).toHaveBeenNthCalledWith(4,
      "Notification/handleError",
      {
        "error": expect.any(Error),
        "rethrow": false,
      }
    );

  });

});
