import Vue from 'vue'
import Vuex, { Store } from 'vuex';
import { Story } from '@storybook/vue/types-6-0';
import { initializeModules as initializeNotifications } from "@platform8/vue2-notify/src/store";
import { AddExpenseAction } from "@/components";
import { Notify } from "@platform8/vue2-notify/src/components";
import { initializeModules } from '@/store';
import { ExpensesModule } from '@/store/expensesModule';
import NotificationModule from "@platform8/vue2-notify/src/store/notificationModule";

import { injectable } from 'inversify-props';
//Kludge....
import { container } from "../../../vue2-budget-manager/node_modules/inversify-props"
import { ApiClient, ApiResponse } from "@platform8/api-client/src";
import Category from "../../../vue2-budget-manager/src/components/CategoryComponent.vue";

@injectable()
class mockApiClient implements ApiClient {
  getAsync<T>(url: string): Promise<ApiResponse<T>> {
    return new Promise<ApiResponse<T>>((resolve, reject) => {
      resolve(
        {
          data: {
            "categories": [
              {
                id: "",
                name: "Housing"
              },
              {
                id: "",
                name: "Transportation"
              },
              {
                id: "",
                name: "Entertainment"
              },
              {
                id: "",
                name: "Education"
              }
            ]
          } as any,
          status: 200,
          statusText: 'OK',
          headers: {}
        });
    });
  }
  getWithAsync<T>(url: string, params: any): Promise<ApiResponse<T>> {
    throw new Error('Method not implemented.');
  }
  postAsync<T>(url: string, data: unknown, headers?: Record<string, unknown>): Promise<ApiResponse<T>> {
    throw new Error('Method not implemented.');
  }
}

container.addTransient<ApiClient>(mockApiClient, "ApiClient");

Vue.component("category", Category);

let store = new Vuex.Store({
  plugins: [
    initializeModules,
    initializeNotifications,
  ],
  modules: {
    "Notification": NotificationModule,
    "Expenses": ExpensesModule,
  }
});

export default {
  title: 'Components/Add Expense Action',
  component: AddExpenseAction
}

const DefaultTemplate: Story =(args, { argTypes}) => ({
  components: { AddExpenseAction, Notify },
  props: Object.keys(args),
  store,
  template: `
  <div style="width: 500px;">
    <notify />
    <div style="height: 100px; border: 1px; border-style: dashed;">
      <add-expense-action v-bind="$props" />
    </div>
  </div>`
});

export const Default = DefaultTemplate.bind({});
Default.args = {
  categoryComponent: 'category'
};
Default.parameters = {
  layout:'centered',
};
