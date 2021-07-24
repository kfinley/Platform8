import Vuex from 'vuex';
import { Story } from '@storybook/vue/types-6-0';
import Budget from "@/components/Budget.vue";
import { Notify } from "@platform8/vue2-notify/src/components";
import { BudgetStatus } from '@/store';
import { testCategories } from 'tests/unit/data';

export default {
  title: 'Components/Budget',
  component: Budget,
};

const DefaultTemplate: Story = (args, { argTypes }) => ({
  components: { Budget, Notify },
  store: new Vuex.Store({
    modules: {
      Budget:{
        state: {
          budget: {
            categories: [],
          },
          status: BudgetStatus.Loaded,
        }
      },
      Notification: {
        state: {
          notifications: [],
        }
      },
    }
  }),
  template: '<div><notify /><budget /></div>'
});

export const Detault = DefaultTemplate.bind({});

const WithDataTemplate: Story = (args, { argTypes }) => ({
  components: { Budget, Notify },
  store: new Vuex.Store({
    modules: {
      Budget:{
        state: {
          budget: {
            categories: testCategories,
          },
          status: BudgetStatus.Loaded,
        }
      },
      Notification: {
        state: {
          notifications: [],
        }
      },
    }
  }),
  template: '<div><notify /><budget /></div>'
});

export const WithData = WithDataTemplate.bind({});

const LoadingTemplate: Story = (args, { argTypes }) => ({
  components: { Budget, Notify },
  store: new Vuex.Store({
    modules: {
      Budget:{
        state: {
          budget: null,
          status: BudgetStatus.Loading
        }
      },
      Notification: {
        state: {
          notifications: []
        }
      }
    }
  }),
  template: '<div><notify /><budget /></div>'
});

export const Loading = LoadingTemplate.bind({});

const AddingCategoryTemplate: Story = (args, { argTypes }) => ({
  components: { Budget, Notify },
  store: new Vuex.Store({
    modules: {
      Budget:{
        state: {
          budget: null,
          status: BudgetStatus.AddingCategory
        }
      },
      Notification: {
        state: {
          notifications: []
        }
      }
    }
  }),
  template: '<div><notify /><budget /></div>'
});

export const AddingCategory = AddingCategoryTemplate.bind({});
