import 'reflect-metadata';

import Vuex, { Dispatch } from "vuex";
import { createLocalVue } from "@vue/test-utils";
import { initializeModules as notificationInitializeModules } from "@platform8/vue2-notify/src/store";
import bootstrapper from "@/bootstrapper";
import { UserModule } from '@/store/userModule';
import NotificationModule from '@platform8/vue2-notify/src/store/notificationModule';
import { AuthStatus, initializeModules, UserState } from '@/store';
import { LoginRequest } from '@/types';
import { LoginCommand } from '@/commands';
import { getModule } from 'vuex-module-decorators';

export const storeFactory = (commit?: any, dispatch?: any) => {
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
  const realDispatch = store.dispatch;

  const testDispatch: Dispatch = function testDispatch(type: string, payload?: any, options?: any) {

    if (type.indexOf("User/") > -1) {
      return realDispatch(type, payload, options);
    } else {
      return dispatch(type, payload, options)
    }
  }

  if (dispatch !== undefined) {
    store.dispatch = testDispatch
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
      const dispatch = jest.fn();

      const loginRunAsyncMock = jest.fn();

      beforeAll(async () => {

        // Arrange
        const store = storeFactory(commit, dispatch);
        const module = getModule(UserModule, store);
        
        module.postAuthFunction = "Module/postAuthFunc";

        LoginCommand.prototype.runAsync = loginRunAsyncMock;
        loginRunAsyncMock.mockReturnValue(Promise.resolve({
          status: AuthStatus.LoggedIn,
          authenticationResult: {
            accessToken: 'xxx-xxx-xxx-xxx',
            expiresIn: 10,
            tokenType: 'jwt',
            refreshToken: 'yyy-yyy-yyy-yyy',
            idToken: 'zzz-zzz-zzz-zzz'
          },
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

      it("should dispatch postAuthentication", () => {

        // Assert
        expect(dispatch).toHaveBeenNthCalledWith(1,
          'Module/postAuthFunc',
          {
            accessToken: 'xxx-xxx-xxx-xxx',
            expiresIn: 10,
            tokenType: 'jwt',
            refreshToken: 'yyy-yyy-yyy-yyy',
            idToken: 'zzz-zzz-zzz-zzz'
          },
          undefined // Even though { root: true } is passed as DispatchOptions vuex.common.makeLocalContext removes it when called.
        );
      })

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
