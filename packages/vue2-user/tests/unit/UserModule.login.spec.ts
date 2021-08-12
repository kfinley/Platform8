import 'reflect-metadata';

import Vuex from "vuex";
import { createLocalVue } from "@vue/test-utils";
import { initializeModules as notificationInitializeModules } from "@platform8/vue2-notify/src/store";
import bootstrapper from "@/bootstrapper";
import { UserModule } from '@/store/userModule';
import NotificationModule from '@platform8/vue2-notify/src/store/notificationModule';
import { initializeModules } from '@/store';
import { LoginRequest } from '@/types';
import { LoginCommand } from '@/commands';

export const storeFactory = (commit?: any) => {
  const localVue = createLocalVue();
  localVue.use(Vuex);

  const store = new Vuex.Store({
    plugins: [
      initializeModules,
      notificationInitializeModules
    ],
    modules: {
      "User": UserModule,
      "Notification": NotificationModule,
    }
  });

  if (commit !== undefined) {
    store.commit = commit;
  }

  return store;
};

const testRequest: LoginRequest = {
  email: "test@test.com",
  password: "p@ssword"
};

describe("UserModule", () => {
  describe("login", () => {
    describe("Success", () => {

      const commit = jest.fn();
      const loginRunAsyncMock = jest.fn();

      beforeAll(async () => {

        // Arrange
        const store = storeFactory(commit);

        LoginCommand.prototype.runAsync = loginRunAsyncMock;
        loginRunAsyncMock.mockReturnValue(Promise.resolve({

        }));

        bootstrapper();

        // Act
        await store.dispatch("User/login", testRequest);

      });

      it("runs", () => {
        expect(commit);
      });

      it("should set the status to LoggingIn", () => {

        // Assert
        expect(commit).toHaveBeenNthCalledWith(2,
          "User/mutate",
          expect.any(Function),
          undefined
        );

        // Check that the function passed to mutate is correct.
        expect(commit.mock.calls[1][1].toString()).toBe('state => state.authStatus = _state.AuthStatus.LoggingIn')

      });

      it("should run LoginCommand", () => {

        // Assert
        expect(loginRunAsyncMock).toHaveBeenCalledWith(testRequest);

      });

      it("should set authTokens", () => {

        // Assert
        // check that mutate was the third call to commit
        expect(commit).toHaveBeenNthCalledWith(3,
          "User/mutate",
          expect.any(Function),
          undefined
        );

        // Check that the function passed to mutate is correct.
        expect(commit.mock.calls[2][1].toString()).toContain("state.authTokens = response.authenticationResult")

      });

      it("should set status", () => {

        // Assert
        expect(commit.mock.calls[2][1].toString()).toContain("state.authStatus = response.status")
      });

      it("should set session", () => {

        // Assert
        expect(commit.mock.calls[2][1].toString()).toContain("state.authSession = response.session")
      });

      // it("should dispatch postAuthentication", () => {

      //   console.log(dispatch.mock.calls);

      //   // Assert
      //   expect(dispatch).toHaveBeenNthCalledWith(2,
      //     "User/postAuthentication",
      //     undefined,
      //     undefined
      //   );
      // });
    });

    describe("Failure", () => {

      const commit = jest.fn();
      const loginRunAsyncMock = jest.fn();

      beforeAll(async () => {

        // Arrange
        const store = storeFactory(commit);

        LoginCommand.prototype.runAsync = loginRunAsyncMock;
        loginRunAsyncMock.mockReturnValue(Promise.resolve({
          success: false,
          error: 'Error thrown for testing'
        }));

        bootstrapper();

        // Act
        await store.dispatch("User/login", testRequest);
      });

      it("should call notificationModule.handleError on fail", () => {
        // Assert
        expect(commit).toHaveBeenNthCalledWith(5,
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
