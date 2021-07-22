import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';
import { BudgetState, BudgetStatus } from './state';
import { notificationModule } from '@platform8/vue2-notify/src/store';
import { container } from 'inversify-props';
import { Budget } from '@/models';

@Module({ namespaced: true, name: 'Budget' })
export class BudgetModule extends VuexModule implements BudgetState {

  budget!: Budget;
  status = BudgetStatus.None;

  @Mutation
  mutate(mutation: (state: BudgetState) => void) {
    mutation(this);
  }
}
