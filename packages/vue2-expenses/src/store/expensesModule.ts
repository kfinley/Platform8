import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';
import { ExpensesState, ExpensesStatus } from './state';
import { notificationModule } from '@platform8/vue2-notify/src/store';
import { container } from 'inversify-props';
// import { LoadExpensesCommand } from '@/commands';
import { AlertType } from '@platform8/vue2-notify/src/types';

@Module({ namespaced: true, name: 'Expenses' })
export class ExpensesModule extends VuexModule implements ExpensesState {
  
  expenses = [];
  status = ExpensesStatus.None;  

  @Action
  addActionActivated(transactionId: string) {
    console.log(`expensesModule.addActionActivated ${transactionId}`);
  }

  // @Action
  // async loadExpenses(params: { }) {
  //   this.context.commit('mutate',
  //     (state: ExpensesState) => state.status = ExpensesStatus.Loading);

  //   try {s
  //     const runParams = {};

  //     const cmd = container.get<LoadExpensesCommand>("LoadExpensesCommand");
  //     const response = await cmd.runAsync(runParams);

  //     if (!response.expenses) {
  //       throw new Error(response.error);
  //     }
  //     this.context.commit('mutate',
  //       (state: ExpensesState) => {          
  //         state.status = ExpensesStatus.Loaded;
  //       }
  //     );

  //   } catch (error) {
  //     this.context.commit('mutate',
  //       (state: ExpensesState) => state.status = ExpensesStatus.Failed);

  //     notificationModule.handleError({ error, rethrow: false });
  //   }
  // }

  @Mutation
  mutate(mutation: (state: ExpensesState) => void) {
    mutation(this);
  }
}
