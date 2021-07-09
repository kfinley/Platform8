import Vuex, { Store } from 'vuex';
import { Story } from '@storybook/vue/types-6-0';
import { action } from '@storybook/addon-actions';
import { UploadTransactions } from "@/components";
import { container, injectable } from 'inversify-props';
import { initializeModules, UploadStatus } from '@/store';
import { initializeModules as initializeNotifications } from "@platform8/vue2-notify/src/store";
import NotificationModule from "@platform8/vue2-notify/src/store/notificationModule";
import { Notify } from "@platform8/vue2-notify/src/components";
import { TransactionsModule } from '@/store/store-modules';

let store = new Vuex.Store({
  plugins: [
    initializeModules,
    initializeNotifications
  ],
  modules: {
    "Transactions": TransactionsModule,
    "Notification": NotificationModule,
  }
});

export default {
  title: 'Components/UploadTransactions',
  component: UploadTransactions,
};

const DefaultTemplate: Story = (args, { argTypes }) => ({
  components: { UploadTransactions, Notify },
  store,
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
