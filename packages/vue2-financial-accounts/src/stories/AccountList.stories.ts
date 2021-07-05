import Vuex from 'vuex';
import { Story } from '@storybook/vue/types-6-0';
import AccountList from "@/components/AccountList.vue";
import { initializeModules } from '@/store';
import { setupModules as setupNotificationModule } from "@platform8/vue2-notify/src/plugin";
import { Notify } from "@platform8/vue2-notify/src/components";
import { testAccountsState as testState } from "./data";

let store = new Vuex.Store({});
setupNotificationModule(store);
initializeModules(store);

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
