import 'reflect-metadata';
import Vuex from "vuex";
import { createLocalVue } from "@vue/test-utils";
import { AddAccountRequest } from "@/models";
import { initializeModules as notificationInitializeModules } from "@platform8/vue2-notify/src/store";
import { AddAccountCommand } from "@/commands";
import bootstrapper from "@/bootstrapper";
import { AccountsModule } from '@/store/accountsModule';
import NotificationModule from '@platform8/vue2-notify/src/store/notificationModule';
import { initializeModules } from '@/store';

export const storeFactory = (commit?: any) => {
  const localVue = createLocalVue();
  localVue.use(Vuex);

  const store = new Vuex.Store({
    plugins: [
      initializeModules,
      notificationInitializeModules
    ],
    modules: {
      "Accounts": AccountsModule,
      "Notification": NotificationModule,
    }
  });

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

describe("AccountsModule", () => {
  describe("AddAccount", () => {
    describe("Success", () => {

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
        expect(commit).toHaveBeenNthCalledWith(3,
          "Accounts/mutate",
          expect.any(Function),
          undefined
        );
        expect(commit.mock.calls[2][1].toString()).toContain("state.accounts.push(");

      });

      it("should set accountsStatus to Loaded", () => {

        // Assert
        expect(commit).toHaveBeenNthCalledWith(3,
          "Accounts/mutate",
          expect.any(Function),
          undefined
        );
        expect(commit.mock.calls[2][1].toString()).toContain("state.accountsStatus = _state.AccountsStatus.Loaded");

      });

    });

    describe("Failure", () => {

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
        expect(commit).toHaveBeenNthCalledWith(3,
          "Accounts/mutate",
          expect.any(Function),
          undefined
        );
        expect(commit.mock.calls[2][1].toString()).toContain("state.accountsStatus = _state.AccountsStatus.Failed");

      });

      it("should call notificationModule.handleError", () => {

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
  });
});
