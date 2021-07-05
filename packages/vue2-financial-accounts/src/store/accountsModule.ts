import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';
import { AccountsState, AccountsStatus } from './state';
import { notificationModule } from '@platform8/vue2-notify/src/store';
import { container } from 'inversify-props';
import { AddAccountCommand } from '../commands';
import { AddAccountRequest } from '../models';

@Module({ namespaced: true, name: 'Accounts' })
export class AccountsModule extends VuexModule implements AccountsState {

  accounts = [];
  accountsStatus = AccountsStatus.Empty;

  @Action
  async addAccount(params: AddAccountRequest) {

    notificationModule.dismissAll();

    this.context.commit('mutate',
      (state: AccountsState) => state.accountsStatus = AccountsStatus.Saving);

    try {
      const cmd = container.get<AddAccountCommand>("AddAccountCommand");
      const response = await cmd.runAsync(params);

      if (!response.success) {
        throw new Error(response.error);
      }

      this.context.commit('mutate',
        (state: AccountsState) => {
          state.accountsStatus = AccountsStatus.Loaded;
          state.accounts.push({
            name: params.name,
            balance: params.startingBalance
          });
        });

    } catch (error) {
      this.context.commit('mutate',
        (state: AccountsState) => state.accountsStatus = AccountsStatus.Failed);

      notificationModule.handleError({ error, rethrow: false });
    }
  }

  @Mutation
  mutate(mutation: (state: AccountsState) => void) {
    mutation(this);
  }
}
