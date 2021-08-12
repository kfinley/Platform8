import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';
import { UserState, AuthStatus } from './state';
import { User, SetPasswordRequest, LoginRequest, AuthenticationResult } from './../types';
import { notificationModule } from '@platform8/vue2-notify/src/store';
import { LoginCommand, SetPasswordCommand } from "../commands";
import { container } from 'inversify-props';
import { authHelper } from '@platform8/api-client/src/helpers'

@Module({ namespaced: true, name: 'User' })
export class UserModule extends VuexModule implements UserState {
  authStatus = AuthStatus.LoggedOut;
  authSession = "";
  currentUser!: User;
  authTokens!: AuthenticationResult;
  postAuthFunction = '';

  @Action
  async login(params: LoginRequest) {
    notificationModule.dismissAll();

    this.context.commit('mutate',
      (state: UserState) => state.authStatus = AuthStatus.LoggingIn);

    try {
      const cmd = container.get<LoginCommand>("LoginCommand");
      const response = await cmd.runAsync(params);

      if (response) {
        this.context.commit('mutate',
          (state: UserState) => {
            state.authTokens = response.authenticationResult;
            state.authStatus = response.status;
            state.authSession = response.session;
          });

        authHelper.setTokens(response.authenticationResult as AuthenticationResult);

        if (this.postAuthFunction) {
          this.context.dispatch(this.postAuthFunction, response.authenticationResult, { root: true });
        }

        if (response.error) {
          throw new Error(response.error);
        }
      } else {
        throw new Error('No response');
      }
    } catch (error) {
      this.context.commit('mutate',
        (state: UserState) => state.authStatus = AuthStatus.LoginFailed);

      notificationModule.handleError({ error, rethrow: false });
    }
  }

  @Action
  async changePassword(params: SetPasswordRequest) {
    notificationModule.dismissAll();

    this.context.commit('mutate',
      (state: UserState) => state.authStatus = AuthStatus.SettingPassword);

    try {
      const response = await container.get<SetPasswordCommand>("SetPasswordCommand")
        .runAsync({
          previousPassword: params.previousPassword,
          proposedPassword: params.proposedPassword,
          username: params.username,
          session: params.session ?? this.authSession,
        });

      if (response) {
        if (response.authenticationResult) {
          this.context.commit("mutate", (state: UserState) => {
            state.authStatus = AuthStatus.LoggedIn;
            state.authTokens = response.authenticationResult as AuthenticationResult;
            state.authSession = undefined;
          });

          authHelper.setTokens(response.authenticationResult as AuthenticationResult);

          if (this.postAuthFunction) {
            this.context.dispatch(this.postAuthFunction, response.authenticationResult, { root: true });
          }
        }

        if (response.error) {
          throw new Error(response.error);
        }
      } else {
        throw new Error('No response');
      }
    } catch (error) {
      this.context.commit('mutate',
        (state: UserState) => state.authStatus = AuthStatus.NewPasswordRequired);

      notificationModule.handleError({ error, rethrow: false });
    }
  }

  @Mutation
  mutate(mutation: (state: UserState) => void) {
    mutation(this);
  }
}
