import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';
import { UserState } from './state';
import { User, AuthStatus, SetPasswordRequest, LoginRequest, AuthenticationResult } from './../types';
import { notificationModule } from '@platform8/vue2-notify/src/store';
import { LoginCommand, SetPasswordCommand } from "../commands";
import { container } from 'inversify-props';

@Module({ namespaced: true, name: 'User' })
export class UserModule extends VuexModule implements UserState {
  authStatus = AuthStatus.LoggedOut;
  authSession = "";
  currentUser!: User;
  authTokens!: AuthenticationResult;

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
            state.authStatus = response.status;
            state.authSession = response.session;
            state.authTokens = response.authenticationResult;
          });
        if (response.error) {
          notificationModule.handleError({ error: response.error, rethrow: false });
        }
      } else {
        this.context.commit('mutate',
          (state: UserState) => state.authStatus = AuthStatus.LoginFailed);
        notificationModule.handleError({ error: 'No response', rethrow: false });
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
          })
        }

        if (response.error) {
          notificationModule.handleError({ error: response.error, rethrow: false });
        }
      } else {
        notificationModule.handleError({ error: 'No response', rethrow: false });
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
