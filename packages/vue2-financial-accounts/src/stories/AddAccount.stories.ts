import Vuex from 'vuex';
import { Story } from '@storybook/vue/types-6-0';
import AddAccount from "@/components/AddAccount.vue";
import { AccountsStatus, initializeModules } from '@/store';
import { setupModules as setupNotificationModule } from "@platform8/vue2-notify/src/plugin";
import { Notify } from "@platform8/vue2-notify/src/components";

let store = new Vuex.Store({});
setupNotificationModule(store);
initializeModules(store);

export default {
  title: 'Components/AddAccount',
  component: AddAccount,
};

const DefaultTemplate: Story = (args, { argTypes }) => ({
  components: { AddAccount, Notify },
  store,
  template: '<div><notify /><add-account /></div>'
});

export const Default = DefaultTemplate.bind({});

const SavingTemplate: Story = (args, { argTypes }) => ({
  components: { AddAccount, Notify },
  props: Object.keys(args),
  store: new Vuex.Store({
    modules: {
      Accounts: {
        state: {
          accountsStatus: AccountsStatus.Saving,
          accounts: [],
        }
      },
      Notification: {
        state: {
          notifications: [],
        }
      },
    }
  }),
  template: '<div><notify /><add-account /></div>'
});

export const Saving = SavingTemplate.bind({});
