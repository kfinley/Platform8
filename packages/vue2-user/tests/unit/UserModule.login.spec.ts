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
import { GetUserDetailsCommand } from '@/commands/getUserDetails';

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
      const getUserDtailsRunAsyncMock = jest.fn();

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

        GetUserDetailsCommand.prototype.runAsync = getUserDtailsRunAsyncMock;
        getUserDtailsRunAsyncMock.mockReturnValue(Promise.resolve({
          username: 'fb6a8285-0f80-4f5c-a586-6a70c94b7f09',
          email: 'bob@jones.com',
          firstName: 'Bob',
          lastName: 'Jones'
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

      it("should run GetUserDetailsCommand", () => {

        // Assert
        expect(loginRunAsyncMock).toHaveBeenCalledWith(testRequest);
      });

      it("should set the currentUser from get user details response", () => {

        // Assert
        expect(commit.mock.calls[2][1].toString()).toContain("state.currentUser = { ...userDetails,");
      });

      it("should set authTokens from login response", () => {

        // Assert
        expect(commit.mock.calls[2][1].toString()).toContain("state.authTokens = login.authenticationResult");
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
      });

      it("should set authStatus from login response", () => {

        // Assert
        expect(commit.mock.calls[3][1].toString()).toContain("state.authStatus = login.status");
      });

      it("should set session from login response", () => {

        // Assert
        expect(commit.mock.calls[3][1].toString()).toContain("state.authSession = login.session");
      });
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
