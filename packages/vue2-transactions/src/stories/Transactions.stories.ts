import { Store } from 'vuex';
import { Story } from '@storybook/vue/types-6-0';
import { Transactions } from "@/components";
import { initializeModules, TransactionsStatus, UploadStatus } from '@/store';
import { initializeModules as initializeNotifications } from "@platform8/vue2-notify/src/store";
import { Notify } from "@platform8/vue2-notify/src/components";
import { AccountsStatus, initializeModules as initializeAccounts } from "@platform8/vue2-financial-accounts/src/store";
import { container, injectable } from 'inversify-props';
import { Command } from '@platform8/commands/src';
import { LoadTransactionsRequest, LoadTransactionsResponse } from '@/models';
import { LoadTransactionsCommand } from '@/commands';
import { testAccountsState, testTransactionsState } from './data';

@injectable()
class mockLoadTransactionsCommand implements Command<LoadTransactionsRequest, LoadTransactionsResponse> {
  public async runAsync(params: LoadTransactionsRequest): Promise<LoadTransactionsResponse> {
    return new Promise(resolve => {
      resolve({
        transactions: [
          {
            id: '123',
            accountId: '123-123-123',
            amount: 23.43,
            description: 'Transaction 1',
            date: new Date('05/11/2021')
          }
        ]
      })
    });
  }
}

container.addTransient<LoadTransactionsCommand>(mockLoadTransactionsCommand, "LoadTransactionsCommand");

// let store = new Store({
//   modules: {
//     Accounts: {
//       state: {
//         accounts: testAccountsState.accounts,
//         accountsStatus: AccountsStatus.Loaded
//       }
//     },
//     Transactions: {
//       state: {
//         transactions: [],
//         transactionsStatus: TransactionsStatus.None,
//         uploadStatus: UploadStatus.None
//       }
//     },
//     Notification: {
//       state: {
//         notifications: [],
//       }
//     },
//   }
// })
// initializeModules(store);
// initializeNotifications(store);
// initializeAccounts(store);

let store = new Store({});

initializeModules(store);
initializeNotifications(store);
initializeAccounts(store);

// let store = new Vuex.Store({
//   plugins: [
//     initializeModules,
//     initializeNotifications,
//     initializeAccounts,
//   ],
//   modules: {
//     "Transactions": TransactionsModule,
//     "Notification": NotificationModule,
//     "Accounts": AccountsModule,
//   }
// });

export default {
  title: 'Components/Transactions',
  component: Transactions,
};

const DefaultTemplate: Story = (args, { argTypes }) => ({
  components: { Transactions, Notify },
  props: Object.keys(args),
  store: new Store({
    modules: {
      Accounts: {
        state: {
          accounts: testAccountsState.accounts,
          accountsStatus: AccountsStatus.Loaded
        }
      },
      Transactions: {
        state: {
          transactions: [],
          transactionsStatus: TransactionsStatus.None,
          uploadStatus: UploadStatus.None
        }
      },
      Notification: {
        state: {
          notifications: [],
        }
      },
    }
  }),
  template: '<div><notify /><transactions v-bind="$props" /></div>'
});

export const Default = DefaultTemplate.bind({});

const WithTransactionsTemplate: Story = (args, { argTypes }) => ({
  components: { Transactions, Notify },
  props: Object.keys(args),
  store: new Store({
    modules: {
      Accounts: {
        state: {
          accounts: testAccountsState.accounts,
          accountsStatus: AccountsStatus.Loaded
        }
      },
      Transactions: {
        state: {
          transactions: testTransactionsState.transactions,
          transactionsStatus: TransactionsStatus.Loaded,
          uploadStatus: UploadStatus.None
        }
      },
      Notification: {
        state: {
          notifications: [],
        }
      },
    }
  }),
  template: '<div><notify /><transactions v-bind="$props" /></div>'
});

export const WithTransactions = WithTransactionsTemplate.bind({});

const UploadingTemplate: Story = (args, { argTypes }) => ({
  components: { Transactions, Notify },
  props: Object.keys(args),
  store: new Store({
    modules: {
      Accounts: {
        state: {
          accounts: testAccountsState.accounts,
          accountsStatus: AccountsStatus.Loaded
        }
      },
      Transactions: {
        state: {
          transactions: testTransactionsState.transactions,
          transactionsStatus: TransactionsStatus.Uploading,
          uploadStatus: UploadStatus.None
        }
      },
      Notification: {
        state: {
          notifications: [],
        }
      },
    }
  }),
  template: '<div><notify /><transactions v-bind="$props" /></div>'
});

export const Uploading = UploadingTemplate.bind({});
