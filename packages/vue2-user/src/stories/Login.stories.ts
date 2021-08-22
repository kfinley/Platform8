import Vuex from 'vuex';
import { Story } from '@storybook/vue/types-6-0';
import { action } from '@storybook/addon-actions';
import Login from "@/components/Login.vue";
import { ApiClient, ApiResponse } from '@platform8/api-client/src';
import { container } from 'inversify-props';
import { AuthStatus } from '@/store';
import { setupModules } from '@/plugin';
import { setupModules as setupNotificationModule } from "@platform8/vue2-notify/src/plugin";
import { Notify } from "@platform8/vue2-notify/src/components";

class mockApiClient implements ApiClient {
  getWithAsync<T>(url: string, params: any): Promise<ApiResponse<T>> {
    throw new Error('Method not implemented.');
  }
  async postAsync<T>(url: string, data: unknown, headers?: Record<string, unknown>): Promise<ApiResponse<T>> {
    action('ApiClient.postAsync')({
      'url': url,
      'data': data,
      'headers': headers
    });

    // Quick sleep to simulate api call
    await new Promise(resolve => setTimeout(resolve, 2000));

    return new Promise<ApiResponse<T>>((resolve, reject) => {
      if ((data as any).email === "fail@mail.com") {
        reject({ message: 'Login Failed!!' });
      }
      resolve({
        data: {
          'Success': true
        } as any as T,
        status: 200,
        statusText: 'Good',
        headers: {},
        request: null
      });
    });
  }
  getAsync<T>(url: string): Promise<ApiResponse<T>> {
    throw new Error('Method not implemented.');
  }
}

// bootstrap DI container
container.bind<ApiClient>('ApiClient').to(mockApiClient);

let store = new Vuex.Store({});
setupNotificationModule(store);
setupModules(store);

export default {
  title: 'Components/User/Login',
  component: Login,
};

const DefaultTemplate: Story = (args, { argTypes }) => ({
  components: { Login, Notify },
  store: new Vuex.Store({
    modules: {
      User: {
        state: {
          authStatus: AuthStatus.LoggedOut
        }
      },
      Notification: {
        state: {
          notifications: [],
        }
      },
      Registration: {
        state: {
        }
      }
    }
  }),
  template: '<div><notify /><login /></div>'
});

export const Default = DefaultTemplate.bind({});

const LoggingInTemplate: Story = (args, { argTypes }) => ({
  components: { Login, Notify },
  store: new Vuex.Store({
    modules: {
      User: {
        state: {
          authStatus: AuthStatus.LoggingIn
        }
      },
      Notification: {
        state: {
          notifications: [],
        }
      },
      Registration: {
        state: {
        }
      }
    }
  }),
  template: '<div><notify /><login /></div>'
});

export const LoggingIn = LoggingInTemplate.bind({});

