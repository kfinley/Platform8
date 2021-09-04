import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';
import { ActionStatus, ExpensesState, ExpensesStatus } from './state';
import { notificationModule } from '@platform8/vue2-notify/src/store';
import { container } from 'inversify-props';
import { AlertType } from '@platform8/vue2-notify/src/types';
import { AddExpenseRequest, ExpensesModuleSettings } from '../models';
import { AddExpenseCommand, LoadExpensesCommand } from '../commands';
import { messages } from "../resources/messages";
import VueRouter from 'vue-router';

@Module({ namespaced: true, name: 'Expenses' })
export class ExpensesModule extends VuexModule implements ExpensesState {

  expenses = [];
  status = ExpensesStatus.None;
  addActionStatus = ActionStatus.None;

  settings!: ExpensesModuleSettings;

  @Action
  addActionActivated(transactionId: string) {
    console.log(`expensesModule.addActionActivated ${transactionId}`);
  }

  @Action
  async addExpense(params: AddExpenseRequest) {
    notificationModule.dismissAll();

    this.context.commit('mutate',
      (state: ExpensesState) => state.addActionStatus = ActionStatus.Saving);

    try {
      const cmd = container.get<AddExpenseCommand>("AddExpenseCommand");
      const response = await cmd.runAsync(params);

      if (!response.success) {
        throw new Error(response.error);
      }

      this.context.commit('mutate',
        (state: ExpensesState) => {
          state.addActionStatus = ActionStatus.Saved;
        }
      );

      notificationModule.add({
        header: messages.Expenses.Add.Success.header,
        message: messages.Expenses.Add.Success.message,
        type: AlertType.success
      });

    } catch (error) {
      this.context.commit('mutate',
        (state: ExpensesState) => {
          state.addActionStatus = ActionStatus.Failed;
        }
      );

      notificationModule.handleError({ error, rethrow: false });
    }
  }

  @Action
  async loadExpenses() {
    this.context.commit('mutate',
      (state: ExpensesState) => state.status = ExpensesStatus.Loading);

    try {
      const cmd = container.get<LoadExpensesCommand>("LoadExpensesCommand");
      const response = await cmd.runAsync({});

      if (!response.expenses) {
        throw new Error(response.error);
      }
      this.context.commit('mutate',
        (state: ExpensesState) => {
          state.expenses = response.expenses;
          state.status = ExpensesStatus.Loaded;
        }
      );

    } catch (error) {
      this.context.commit('mutate',
        (state: ExpensesState) => state.status = ExpensesStatus.Failed);

      notificationModule.handleError({ error, rethrow: false });
    }
  }

  @Action
  close(router: VueRouter) {
    this.context.commit('mutate',
        (state: ExpensesState) => {
          state.status = ExpensesStatus.Loaded;
        });
    router.push({ name: this.settings.onCloseRedirectRouteName });
  }

  @Mutation
  mutate(mutation: (state: ExpensesState) => void) {
    mutation(this);
  }
}
