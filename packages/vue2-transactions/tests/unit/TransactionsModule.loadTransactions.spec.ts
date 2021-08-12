import 'reflect-metadata';
import Vuex from "vuex";
import { createLocalVue } from "@vue/test-utils";
import { initializeModules } from "@/store";
import { initializeModules as notificationInitializeModules } from "@platform8/vue2-notify/src/store";
import { LoadTransactionsCommand } from "@/commands";
import bootstrapper from "@/bootstrapper";
import { TransactionsModule } from '@/store/store-modules';
import NotificationModule from '@platform8/vue2-notify/src/store/notificationModule';
import { TransactionStatus } from '@/models';
import { testAccountsState, testTransactionsState } from "@/stories/data";

export const storeFactory = (commit?: any) => {
  const localVue = createLocalVue();
  localVue.use(Vuex);

  const store = new Vuex.Store({
    plugins: [
      initializeModules,
      notificationInitializeModules
    ],
    modules: {
      "Transactions": TransactionsModule,
      "Notification": NotificationModule,
    }
  });

  if (commit !== undefined) {
    store.commit = commit;
  }

  return store;
};

describe("TransactionsModule", () => {
  describe("loadTransactions", () => {
    describe("Success", () => {

      const commit = jest.fn();
      const loadTransactionsRunAsyncMock = jest.fn();

      beforeAll(async () => {

        // Arrange
        const store = storeFactory(commit);

        LoadTransactionsCommand.prototype.runAsync = loadTransactionsRunAsyncMock;
        loadTransactionsRunAsyncMock.mockReturnValue(Promise.resolve({
          transactions: testTransactionsState.transactions
        }));

        bootstrapper();

        // Act
        await store.dispatch("Transactions/loadTransactions", {
          status: TransactionStatus.Unreviewed,
          accounts: testAccountsState.accounts
        });
      });

      it("should dispatch Transactions/loadTransactions", () => {
        expect(commit);
      });

      it("should set the transactionsStatus to Loading", () => {

        // Assert
        expect(commit).toHaveBeenNthCalledWith(1,
          "Transactions/mutate",
          expect.any(Function),
          undefined
        );

        // Check that the function passed to mutate is correct.
        expect(commit.mock.calls[0][1].toString()).toBe('state => state.transactionsStatus = _state.TransactionsStatus.Loading')

      });

      it("should run LoadTransactions", () => {

        // Assert
        expect(loadTransactionsRunAsyncMock).toHaveBeenCalledWith({
          status: TransactionStatus.Unreviewed
        });
      });

      it("should set transactionsStatus to Loaded", () => {

        // Assert
        expect(commit).toHaveBeenNthCalledWith(2,
          "Transactions/mutate",
          expect.any(Function),
          undefined
        );
        expect(commit.mock.calls[1][1].toString()).toContain("state.transactionsStatus = _state.TransactionsStatus.Loaded");

      });

      it("should set transactions", () => {

        // Assert
        expect(commit).toHaveBeenNthCalledWith(2,
          "Transactions/mutate",
          expect.any(Function),
          undefined
        );
        expect(commit.mock.calls[1][1].toString()).toContain("state.transactions = response.transactions");

      });
    });

    describe("Failure", () => {

      const commit = jest.fn();
      const loadTransactionsRunAsyncMock = jest.fn();

      beforeAll(async () => {

        // Arrange
        const store = storeFactory(commit);

        LoadTransactionsCommand.prototype.runAsync = loadTransactionsRunAsyncMock;
        loadTransactionsRunAsyncMock.mockReturnValue(Promise.resolve({
          success: false,
          error: 'Error thrown for testing'
        }));

        bootstrapper();

        // Act
        await store.dispatch("Transactions/loadTransactions", {
          status: TransactionStatus.Unreviewed,
          accounts: testAccountsState.accounts
        });
      });

      it("should set transactionsStatus to Failed", () => {

        // Assert
        expect(commit).toHaveBeenNthCalledWith(2,
          "Transactions/mutate",
          expect.any(Function),
          undefined
        );
        expect(commit.mock.calls[1][1].toString()).toContain("state.transactionsStatus = _state.TransactionsStatus.Failed");

      });

      it("should call notificationModule.handleError", () => {

        // Assert
        expect(commit).toHaveBeenNthCalledWith(3,
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
