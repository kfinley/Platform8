import Vuex from 'vuex';
import { Story } from '@storybook/vue/types-6-0';
import Budget from "@/components/Budget.vue";
import { Notify } from "@platform8/vue2-notify/src/components";
import { store } from './store';
import { BudgetStatus } from '@/store';

export default {
  title: 'Components/Budget',
  component: Budget,
};

const DefaultTemplate: Story = (args, { argTypes }) => ({
  components: { Budget, Notify },
  store,
  template: '<div><notify /><budget /></div>'
});

export const Default = DefaultTemplate.bind({});

const LoadingTemplate: Story = (args, { argTypes }) => ({
  components: { Budget },
  store: new Vuex.Store({
    modules: {
      Budget:{
        state: {
          budget: null,
          budgetStatus: BudgetStatus.Loading
        }
      }
    }
  }),
  template: '<budget />'
});

export const Loading = LoadingTemplate.bind({});
