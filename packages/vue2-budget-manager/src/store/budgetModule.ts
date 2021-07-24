import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';
import { BudgetState, BudgetStatus } from './state';
import { notificationModule } from '@platform8/vue2-notify/src/store';
import { container } from 'inversify-props';
import { AddCategoryCommand, GetBudgetCommand } from './../commands';
import { AddCategoryRequest, Budget, BudgetModuleSettings } from '@/models';
import VueRouter from 'vue-router';

@Module({ namespaced: true, name: 'Budget' })
export class BudgetModule extends VuexModule implements BudgetState {

  settings!: BudgetModuleSettings;

  budget!: Budget;
  status = BudgetStatus.None;

  @Action
  async loadBudget() {
    notificationModule.dismissAll();

    this.context.commit('mutate',
      (state: BudgetState) => state.status = BudgetStatus.Loading);

    try {

      const cmd = container.get<GetBudgetCommand>("GetBudgetCommand");
      const response = await cmd.runAsync({});

      if (!response) {
        throw new Error("Could not load budget.");
      }

      this.context.commit('mutate',
        (state: BudgetState) => {
          state.budget = response.budget;
        });

      this.context.commit('mutate',
        (state: BudgetState) => {
          state.status = BudgetStatus.Loaded;
        });

    } catch (error) {
      this.context.commit('mutate',
        (state: BudgetState) => state.status = BudgetStatus.Failed);

      notificationModule.handleError({ error, rethrow: false });
    }
  }

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
          state.budget = state.budget ?? { id: response.budgetId, categories: [] };
          state.budget.categories.push({
            id: response.id,
            name: params.name,
            allocation: params.allocation,
            classifications: []
          });
          state.status = BudgetStatus.Loaded;
        });

    } catch (error) {
      notificationModule.handleError({ error, rethrow: false });
    }
  }

  @Action
  close(router: VueRouter) {
    this.context.commit('mutate',
        (state: BudgetState) => {
          state.status = BudgetStatus.Loaded;
        });
    router.push({ name: this.settings.onCloseRedirectRouteName });
  }

  @Mutation
  mutate(mutation: (state: BudgetState) => void) {
    mutation(this);
  }
}
