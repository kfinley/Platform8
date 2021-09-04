import { Store } from 'vuex';
import { Story } from '@storybook/vue/types-6-0';
import { ExpensesList } from "@/components";
import { Notify } from "@platform8/vue2-notify/src/components";
import { testExpensesState } from './data';

export default {
  title: 'Components/Expenses/Expenses List',
  component: ExpensesList,
};

const DefaultTemplate: Story = (args, { argTypes }) => ({
  components: { ExpensesList, Notify },
  props: Object.keys(args),
  store: new Store({
    modules: {
      Expenses: {
        state: testExpensesState
      },
      Notification: {
        state: {
          notifications: [],
        }
      },
    }
  }),
  template: '<div><notify /><expenses-list v-bind="$props" /></div>'
});

export const Default = DefaultTemplate.bind({});
