import Vuex from 'vuex';
import { Story } from '@storybook/vue/types-6-0';
import AccountList from "@/components/AccountList.vue";
import { initializeModules } from '@/store';
import { initializeModules as initializeNotifications } from "@platform8/vue2-notify/src/store";
import { Notify } from "@platform8/vue2-notify/src/components";
import { testAccountsState as testState } from "./data";
import NotificationModule from '@platform8/vue2-notify/src/store/notificationModule';
import { AccountsModule } from '@/store/accountsModule';

let store = new Vuex.Store({
  plugins: [
    initializeModules,
    initializeNotifications,
  ],
  modules: {
    "Notification": NotificationModule,
    "Accounts": AccountsModule,
  }
});

export default {
  title: 'Components/AccountList',
  component: AccountList,
};

const DefaultTemplate: Story = (args, { argTypes }) => ({
  components: { AccountList, Notify },
  store,
  template: '<div><notify /><account-list /></div>'
});

export const Default = DefaultTemplate.bind({});

const WithDataTemplate: Story = (args, { argTypes }) => ({
  components: { AccountList, Notify },
  store: new Vuex.Store({
    modules: {
      Accounts: {
        state: testState
      },
      Notification: {
        state: {
          notifications: []
        }
      }
    }
  }),
  template: '<div><notify /><account-list /></div>'
});

export const WithData = WithDataTemplate.bind({});
