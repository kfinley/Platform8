import 'reflect-metadata';
import Vuex from "vuex";
import { createLocalVue } from "@vue/test-utils";
import { initializeModules } from "@/store";
import { initializeModules as notificationInitializeModules } from "@platform8/vue2-notify/src/store";
import { LoadExpensesCommand } from "@/commands";
import bootstrapper from "@/bootstrapper";
import { ExpensesModule } from '@/store/expensesModule';
import NotificationModule from '@platform8/vue2-notify/src/store/notificationModule';
import { testExpensesState } from "@/stories/data";

export const storeFactory = (commit?: any) => {
  const localVue = createLocalVue();
  localVue.use(Vuex);

  const store = new Vuex.Store({
    plugins: [
      initializeModules,
      notificationInitializeModules,

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

describe("ExpensesModule", () => {
  describe("loadExpenses", () => {
    describe("Success", () => {

      const commit = jest.fn();
      const loadExpensesRunAsyncMock = jest.fn();

      beforeAll(async () => {

        // Arrange
        const store = storeFactory(commit);

        LoadExpensesCommand.prototype.runAsync = loadExpensesRunAsyncMock;
        loadExpensesRunAsyncMock.mockReturnValue(Promise.resolve({
          expenses: testExpensesState.expenses
        }));

        bootstrapper();

        // Act
        await store.dispatch("Expenses/loadExpenses", {

        });
      });

      it("should dispatch Expenses/loadExpenses", () => {
        expect(commit);
      });

      it("should set the ExpensesStatus to Loading", () => {

        // Assert
        expect(commit).toHaveBeenNthCalledWith(1,
          "Expenses/mutate",
          expect.any(Function),
          undefined
        );

        // Check that the function passed to mutate is correct.
        expect(commit.mock.calls[0][1].toString()).toBe('state => state.status = _state.ExpensesStatus.Loading')

      });

      it("should run LoadExpenses", () => {

        // Assert
        expect(loadExpensesRunAsyncMock).toHaveBeenCalledWith({});
      });

      it("should set ExpensesStatus to Loaded", () => {

        // Assert
        expect(commit).toHaveBeenNthCalledWith(2,
          "Expenses/mutate",
          expect.any(Function),
          undefined
        );
        expect(commit.mock.calls[1][1].toString()).toContain("state.status = _state.ExpensesStatus.Loaded");

      });

      it("should set Expenses", () => {

        // Assert
        expect(commit).toHaveBeenNthCalledWith(2,
          "Expenses/mutate",
          expect.any(Function),
          undefined
        );
        expect(commit.mock.calls[1][1].toString()).toContain("state.expenses = response.expenses");

      });
    });

    describe("Failure", () => {

      const commit = jest.fn();
      const loadExpensesRunAsyncMock = jest.fn();

      beforeAll(async () => {

        // Arrange
        const store = storeFactory(commit);

        LoadExpensesCommand.prototype.runAsync = loadExpensesRunAsyncMock;
        loadExpensesRunAsyncMock.mockReturnValue(Promise.resolve({
          success: false,
          error: 'Error thrown for testing'
        }));

        bootstrapper();

        // Act
        await store.dispatch("Expenses/loadExpenses", {});
      });

      it("should set ExpensesStatus to Failed", () => {

        // Assert
        expect(commit).toHaveBeenNthCalledWith(2,
          "Expenses/mutate",
          expect.any(Function),
          undefined
        );
        expect(commit.mock.calls[1][1].toString()).toContain("state.status = _state.ExpensesStatus.Failed");

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
