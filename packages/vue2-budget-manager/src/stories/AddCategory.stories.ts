import Vuex from 'vuex';
import { Story } from '@storybook/vue/types-6-0';
import AddCategory from "@/components/AddCategory.vue";
import { Notify } from "@platform8/vue2-notify/src/components";
import { store } from './store';
import { BudgetStatus } from '@/store';

export default {
  title: 'Components/Budget/Add Category',
  component: AddCategory,
};

const DefaultTemplate: Story = (args, { argTypes }) => ({
  components: { AddCategory, Notify },
  store,
  template: '<div><notify /><add-category /></div>'
});

export const Default = DefaultTemplate.bind({});

const SavingTemplate: Story = (args, { argTypes }) => ({
  components: { AddCategory, Notify },
  store: new Vuex.Store({
    modules: {
      Budget: {
        state: {
          status: BudgetStatus.Saving,
        }
      },
      Notification: {
        state: {
          notifications: [],
        }
      }
    }
  }),
  template: '<div><notify /><add-category /></div>'
});

export const Saving = SavingTemplate.bind({});
