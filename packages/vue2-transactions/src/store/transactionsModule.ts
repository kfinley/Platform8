import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';
import { TransactionsState } from './state';
import { notificationModule } from '@platform8/vue2-notify/src/store';
import { container } from 'inversify-props';

@Module({ namespaced: true, name: 'Transactions' })
export class TransactionsModule extends VuexModule implements TransactionsState {
  transactions = [];

  @Mutation
  mutate(mutation: (state: TransactionsState) => void) {
    mutation(this);
  }
}
