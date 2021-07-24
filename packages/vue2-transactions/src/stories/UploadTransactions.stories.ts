import Vuex, { Store } from 'vuex';
import { Story } from '@storybook/vue/types-6-0';
import { UploadTransactions } from "@/components";
import { initializeModules, UploadStatus } from '@/store';
import { initializeModules as initializeNotifications } from "@platform8/vue2-notify/src/store";
import NotificationModule from "@platform8/vue2-notify/src/store/notificationModule";
import { Notify } from "@platform8/vue2-notify/src/components";
import { TransactionsModule } from '@/store/store-modules';
import { AccountsModule } from '@platform8/vue2-accounts/src/store/store-modules';
import { AccountsStatus, initializeModules as initializeAccounts } from "@platform8/vue2-accounts/src/store";

let store = new Vuex.Store({
  plugins: [
    initializeModules,
    initializeNotifications,
    initializeAccounts,
  ],
  modules: {
    "Transactions": TransactionsModule,
    "Notification": NotificationModule,
    "Accounts": AccountsModule,
  }
});

export default {
  title: 'Components/UploadTransactions',
  component: UploadTransactions,
};

const DefaultTemplate: Story = (args, { argTypes }) => ({
  components: { UploadTransactions, Notify },
  store: new Store({
    modules: {
      Accounts: {
        state: {
          accounts: [
            {
              id: '123-123-123',
              name: 'Checking',
              balance: 2345.23,
            }
          ],
          accountsStatus: AccountsStatus.Loaded
        }
      },
      Transactions: {
        state: {
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
  template: '<div><notify /><upload-transactions /></div>'
});

export const Default = DefaultTemplate.bind({});

const UploadingTemplate: Story = (args, { argTypes }) => ({
  components: { UploadTransactions, Notify },
  store: new Store({
    modules: {
      Transactions: {
        state: {
          uploadStatus: UploadStatus.Uploading
        }
      },
      Notification: {
        state: {
          notifications: [],
        }
      },
    }
  }),
  template: '<div><notify /><upload-transactions /></div>'
});

export const Uploading = UploadingTemplate.bind({});
