import 'reflect-metadata'; // <-- deal with this...
import Vuex from "vuex";
import { createLocalVue } from "@vue/test-utils";
import { AddCategoryRequest } from "@/models";
import { initializeModules as notificationInitializeModules } from "@platform8/vue2-notify/src/store";
import { AddCategoryCommand } from "@/commands";
import bootstrapper from "@/boot-strapper";
import { BudgetModule } from '@/store/budgetModule';
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
      "Budget": BudgetModule,
      "Notification": NotificationModule,
    }
  });

  if (commit !== undefined) {
    store.commit = commit;
  }

  return store;
};

const testRequest: AddCategoryRequest = {
  name: "Housing",
  allocation: {
    start: 25,
    end: 35
  }
};

describe("BudgetModule.AddCategory - Success", () => {

  const commit = jest.fn();
  const addCategoryRunAsyncMock = jest.fn();

  beforeAll(async () => {

    // Arrange
    const store = storeFactory(commit);

    AddCategoryCommand.prototype.runAsync = addCategoryRunAsyncMock;
    addCategoryRunAsyncMock.mockReturnValue(Promise.resolve({
      id: '123-123-123',
      success: true
    }));

    bootstrapper();

    // Act
    await store.dispatch("Budget/addCategory", testRequest);

  });

  it("runs", () => {
    expect(commit);
  });

  it("should set the status to Saving", () => {

    // Assert
    // check that mutate was the second call to commit
    expect(commit).toHaveBeenNthCalledWith(2,
      "Budget/mutate",
      expect.any(Function),
      undefined
    );

    // Check that the function passed to mutate is correct.
    expect(commit.mock.calls[1][1].toString()).toBe('state => state.status = _state.BudgetStatus.Saving')

  });

  it("should run AddCategoryCommand", () => {

    // Assert
    expect(addCategoryRunAsyncMock).toHaveBeenCalledWith(testRequest);

  });

  it("should save the new Category in the Budget store", () => {

    // Assert
    // check that mutate was the second call to commit
    expect(commit).toHaveBeenNthCalledWith(3,
      "Budget/mutate",
      expect.any(Function),
      undefined
    );

    expect(commit.mock.calls[2][1].toString()).toContain("state.budget.categories.push({");

  });

  it("should set the Category classifications collection to an empty set in the Budget store", () => {

    // Assert
    // check that mutate was the second call to commit
    expect(commit).toHaveBeenNthCalledWith(3,
      "Budget/mutate",
      expect.any(Function),
      undefined
    );

    expect(commit.mock.calls[2][1].toString()).toContain("classifications: []");

  });

  it("should set status to Loaded", () => {

    // Assert
    // check that mutate was the second call to commit
    expect(commit).toHaveBeenNthCalledWith(3,
      "Budget/mutate",
      expect.any(Function),
      undefined
    );
    
    expect(commit.mock.calls[2][1].toString()).toContain("state.status = _state.BudgetStatus.Loaded");

  });

});

describe("BudgetModule.AddCategory - Fail", () => {

  const commit = jest.fn();
  const addCategoryRunAsyncMock = jest.fn();

  beforeAll(async () => {

    // Arrange
    const store = storeFactory(commit);

    AddCategoryCommand.prototype.runAsync = addCategoryRunAsyncMock;
    addCategoryRunAsyncMock.mockReturnValue(Promise.resolve({
      success: false,
      error: 'Error thrown for testing'
    }));

    bootstrapper();

    // Act
    await store.dispatch("Budget/addCategory", testRequest);
  });

  it("should call notificationModule.handleError on fail", () => {
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
