import { Store } from 'vuex';
import { Story } from '@storybook/vue/types-6-0';
import { ExpensesList } from "@/components";
// import { TransactionsStatus, UploadStatus } from '@/store';
import { Notify } from "@platform8/vue2-notify/src/components";
// import { AccountsStatus } from "@platform8/vue2-accounts/src/store";
import { container } from 'inversify-props';
import { Command } from '@platform8/commands/src';
// import { LoadTransactionsRequest, LoadTransactionsResponse } from '@/models';
// import { LoadTransactionsCommand } from '@/commands';
// import { testAccountsState, testTransactionsState } from './data';

// class mockLoadTransactionsCommand implements Command<LoadTransactionsRequest, LoadTransactionsResponse> {
//   public async runAsync(params: LoadTransactionsRequest): Promise<LoadTransactionsResponse> {
//     return new Promise(resolve => {
//       resolve({
//         transactions: [
//           {
//             id: '123',
//             accountId: '123-123-123',
//             amount: 23.43,
//             description: 'Transaction 1',
//             date: new Date('05/11/2021'),
//             hasChanges: false
//           }
//         ]
//       })
//     });
//   }
// }

// if (container.isBound("LoadTransactionsCommand")) {
//   container.addTransient<LoadTransactionsCommand>(mockLoadTransactionsCommand, "LoadTransactionsCommand");
// }

export default {
  title: 'Components/Expenses/Expenses List',
  component: ExpensesList,
};

const DefaultTemplate: Story = (args, { argTypes }) => ({
  components: { ExpensesList, Notify },
  props: Object.keys(args),
  store: new Store({
    modules: {
      Notification: {
        state: {
          notifications: [],
        }
      },
    }
  }),
  template: '<div><notify /><expenses-list v-bind="$props" /></div>'
});

export const Default = DefaultTemplate.bind({});
