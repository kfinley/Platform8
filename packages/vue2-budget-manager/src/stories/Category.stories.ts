import Vuex from 'vuex';
import { Story } from '@storybook/vue/types-6-0';
import { Category } from "@/components";
import { Notify } from "@platform8/vue2-notify/src/components";
import { store } from './store';
import { container, injectable } from 'inversify-props';
import { ApiClient, ApiResponse } from "@platform8/api-client/src";

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

export default {
  title: 'Components/Category',
  component: Category,
};

const DefaultTemplate: Story = (args, { argTypes }) => ({
  components: { Category, Notify },
  props: Object.keys(args),
  store,
  template: `
  <div>
    <notify />
    <div style="height: 100px; width: 200px;">
      <category v-bind="$props" />
    </div>
  </div>`
});

export const Default = DefaultTemplate.bind({});

Default.parameters = {
  layout: 'centered',
};