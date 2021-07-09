import 'reflect-metadata'; // <-- deal with this...
import Vuex from "vuex";
import { createLocalVue } from "@vue/test-utils";
import { initializeModules } from "@/store";
import { initializeModules as notificationInitializeModules } from "@platform8/vue2-notify/src/store";
import { UploadFileCommand } from "@/commands";
import bootstrapper from "@/bootstrapper";
import { TransactionsModule } from '@/store/store-modules';
import NotificationModule from '@platform8/vue2-notify/src/store/notificationModule';
import { messages } from '@/resources/messages';
import { AlertType } from '@platform8/vue2-notify/src/types';

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

const testFile = {
  name: "stmt.csv",
  lastModified: 1625760617924,
  lastModifiedDate: "Thu Jul 08 2021 09:10:17 GMT-0700 (Pacific Daylight Time)",
  webkitRelativePath: "",
  size: 743,
  type: "text/csv"
}

describe("TransactionsModule.uploadFile - Success", () => {

  const commit = jest.fn();
  const uploadFileRunAsyncMock = jest.fn();

  
  beforeAll(async () => {

    // Arrange
    const store = storeFactory(commit);

    UploadFileCommand.prototype.runAsync = uploadFileRunAsyncMock;
    uploadFileRunAsyncMock.mockReturnValue(Promise.resolve({
      success: true
    }));

    bootstrapper();

    // Act
    await store.dispatch("Transactions/uploadTransactions",
      {
        file: testFile
      });
  });

  it("should dispatch Transactions/uploadTransactions", () => {
    expect(commit);
  });

  it("should set the uploadStatus to Uploading", () => {

    // Assert
    // check that mutate was the second call to commit
    expect(commit).toHaveBeenNthCalledWith(2,
      "Transactions/mutate",
      expect.any(Function),
      undefined
    );

    // Check that the function passed to mutate is correct.
    expect(commit.mock.calls[1][1].toString()).toBe('state => state.uploadStatus = _state.UploadStatus.Uploading')

  });

  it("should run UploadFileCommand", () => {

    // Assert
    expect(uploadFileRunAsyncMock).toHaveBeenCalledWith(
      {
        file: testFile,
        bucket: 'uploads-transactions'
      });
  });

  it("should set uploadStatus to Success", () => {

    // Assert
    // check that mutate was the second call to commit
    expect(commit).toHaveBeenNthCalledWith(3,
      "Transactions/mutate",
      expect.any(Function),
      undefined
    );
    expect(commit.mock.calls[2][1].toString()).toContain("state.uploadStatus = _state.UploadStatus.Success");

  });

  it("should notify success with a message", () => {
    // Assert
    expect(commit).toHaveBeenNthCalledWith(4,
      "Notification/add",
      {
        header: messages.Transactions.Upload.Success.header,
        message: messages.Transactions.Upload.Success.message,
        type: AlertType.success
      }
    );
  });

});

describe("TransactionsModule.uploadFile - Fail", () => {

  const commit = jest.fn();
  const uploadFileRunAsyncMock = jest.fn();

  beforeAll(async () => {

    // Arrange
    const store = storeFactory(commit);

    UploadFileCommand.prototype.runAsync = uploadFileRunAsyncMock;
    uploadFileRunAsyncMock.mockReturnValue(Promise.resolve({
      success: false,
      error: 'Error thrown for testing'
    }));

    bootstrapper();

    // Act
    await store.dispatch("Transactions/uploadTransactions", { file: testFile });
  });

  it("should set accountsStatus to Failed on fail", () => {
    // Assert
    // check that mutate was the third(?) call to commit
    expect(commit).toHaveBeenNthCalledWith(3,
      "Transactions/mutate",
      expect.any(Function),
      undefined
    );
    expect(commit.mock.calls[2][1].toString()).toContain("state.uploadStatus = _state.UploadStatus.Fialed");

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
