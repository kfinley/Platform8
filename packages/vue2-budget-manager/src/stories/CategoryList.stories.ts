import Vuex from 'vuex';
import { Story } from '@storybook/vue/types-6-0';
import CategoryList from "@/components/CategoryList.vue";
import { Notify } from "@platform8/vue2-notify/src/components";
import { store } from './store';
import { BudgetStatus } from '@/store';
import { testCategories } from './../../tests/unit/data';

export default {
  title: 'Components/CategoryList',
  component: CategoryList,
};

const DefaultTemplate: Story = (args, { argTypes }) => ({
  components: { CategoryList, Notify },
  store,
  template: '<div><notify /><category-list /></div>'
});

export const Default = DefaultTemplate.bind({});

const WithDataTemplate: Story = (args, { argTypes }) => ({
  components: { CategoryList },
  store: new Vuex.Store({
    modules: {
      Budget:{
        state: {
          budget: {
            categories: testCategories
          },
          budgetStatus: BudgetStatus.Loaded
        }
      }
    }
  }),
  template: '<category-list />'
});

export const WithData = WithDataTemplate.bind({});
