import Vuex from 'vuex';
import { Story } from '@storybook/vue/types-6-0';
import { action } from '@storybook/addon-actions';
import Accounts from "@/components/Accounts.vue";
import { container, injectable } from 'inversify-props';
import { initializeModules } from '@/store';
import { setupModules as setupNotificationModule } from "@platform8/vue2-notify/src/plugin";
import { Notify } from "@platform8/vue2-notify/src/components";

let store = new Vuex.Store({});
setupNotificationModule(store);
initializeModules(store);

export default {
  title: 'Components/Accounts',
  component: Accounts,
};

const DefaultTemplate: Story = (args, { argTypes }) => ({
  components: { Accounts, Notify },
  store,
  template: '<div><notify /><accounts /></div>'
});

export const Default = DefaultTemplate.bind({});