import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';
import { BudgetState, BudgetStatus } from './state';
import { notificationModule } from '@platform8/vue2-notify/src/store';
import { container } from 'inversify-props';
import { AddCategoryCommand } from './../commands';
import { AddCategoryRequest, Budget } from '@/models';

@Module({ namespaced: true, name: 'Budget' })
export class BudgetModule extends VuexModule implements BudgetState {

  budget!: Budget;
  status = BudgetStatus.None;

  @Action
  async addCategory(params: AddCategoryRequest) {

    notificationModule.dismissAll();

    this.context.commit('mutate',
    (state: BudgetState) => state.status = BudgetStatus.Saving);

    try {
      const cmd = container.get<AddCategoryCommand>("AddCategoryCommand");
      const response = await cmd.runAsync(params);

      if (!response.success) {
        throw new Error(response.error);
      }

      this.context.commit('mutate',
        (state: BudgetState) => {
          state.status = BudgetStatus.Loaded;          
          state.budget.categories.push({
            id: response.id,
            name: params.name,
            allocation: params.allocation,
            classifications: []
          });
        });

    } catch (error) {
      notificationModule.handleError({ error, rethrow: false });
    }
  }
  
  @Mutation
  mutate(mutation: (state: BudgetState) => void) {
    mutation(this);
  }
}
