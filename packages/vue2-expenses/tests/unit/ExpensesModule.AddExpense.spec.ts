import 'reflect-metadata';
import Vuex from "vuex";
import { createLocalVue } from "@vue/test-utils";
import { AddExpenseRequest } from "@/models";
import { initializeModules as notificationInitializeModules } from "@platform8/vue2-notify/src/store";
import { AddExpenseCommand } from "@/commands";
import bootstrapper from "@/bootstrapper";
import { ExpensesModule } from '@/store/expensesModule';
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
      "Expenses": ExpensesModule,
      "Notification": NotificationModule,
    }
  });

  if (commit !== undefined) {
    store.commit = commit;
  }

  return store;
};

const testRequest: AddExpenseRequest = {
  description: 'Test Expense',
  amount: 10.23,
  isFullTransaction: true,
  transactionId: '234l234lkj',
  categoryId: '9fba3f8d-6844-4ebf-8b97-edbca2fed739 '
};

describe("ExpensesModule", () => {
  describe("AddExpense", () => {
    describe("Succes", () => {

      const commit = jest.fn();
      const addExpenseRunAsyncMock = jest.fn();

      beforeAll(async () => {

        // Arrange
        const store = storeFactory(commit);

        AddExpenseCommand.prototype.runAsync = addExpenseRunAsyncMock;
        addExpenseRunAsyncMock.mockReturnValue(Promise.resolve({
          id: '123-123-123',
          success: true
        }));

        bootstrapper();

        // Act
        await store.dispatch("Expenses/addExpense", testRequest);

      });

      it("runs", () => {
        expect(commit);
      });

      it("should set the status to Saving", () => {

        // Assert
        expect(commit).toHaveBeenNthCalledWith(2,
          "Expenses/mutate",
          expect.any(Function),
          undefined
        );

        // Check that the function passed to mutate is correct.
        expect(commit.mock.calls[1][1].toString()).toBe('state => state.addActionStatus = _state.ActionStatus.Saving')

      });

      it("should run AddExpenseCommand", () => {

        // Assert
        expect(addExpenseRunAsyncMock).toHaveBeenCalledWith(testRequest);

      });

      it("should set addActionStatus to Saved", () => {

        // Assert
        expect(commit).toHaveBeenNthCalledWith(3,
          "Expenses/mutate",
          expect.any(Function),
          undefined
        );

        expect(commit.mock.calls[2][1].toString()).toContain("state.addActionStatus = _state.ActionStatus.Saved");

      });

      it("should notify the Expense was saved", () => {

        // Assert
        expect(commit).toHaveBeenNthCalledWith(4,
          "Notification/add",
          {
            "header": "Expense saved!",
            "message": "Your expense has been saved.",
            "type": "success"
          }
        );

      });

    });
    describe("Failure", () => {

      const commit = jest.fn();
      const addExpenseRunAsyncMock = jest.fn();

      beforeAll(async () => {

        // Arrange
        const store = storeFactory(commit);

        AddExpenseCommand.prototype.runAsync = addExpenseRunAsyncMock;
        addExpenseRunAsyncMock.mockReturnValue(Promise.resolve({
          success: false,
          error: 'Error thrown for testing'
        }));

        bootstrapper();

        // Act
        await store.dispatch("Expenses/addExpense", testRequest);
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
    })
  })
});
