import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';
import { AccountsState } from './state';
import { notificationModule } from '@platform8/vue2-notify/src/store';
import { container } from 'inversify-props';

@Module({ namespaced: true, name: 'Accounts' })
export class AccountsModule extends VuexModule implements AccountsState {
  accounts = [];

  @Mutation
  mutate(mutation: (state: AccountsState) => void) {
    mutation(this);
  }
}
