import Vuex from 'vuex';
import { Story } from '@storybook/vue/types-6-0';
import { action } from '@storybook/addon-actions';
import Register from "@/components/Register.vue";
import { ApiClient, ApiResponse } from '@platform8/api-client/src';
import { container, injectable } from 'inversify-props';
import { RegistrationStatus } from '@/store/types';
import { setupModules } from '@/plugin';
import { setupModules as setupNotificationModule } from "@platform8/vue2-notify/src/plugin";
import { Notify } from "@platform8/vue2-notify/src/components";
import { AlertType } from '@/types';
import { messages } from '@/resources/messages';

@injectable()
class mockApiClient implements ApiClient {
  async postAsync<T>(url: string, data: unknown, headers?: Record<string, unknown>): Promise<ApiResponse<T>> {
    action('ApiClient.postAsync')({
      'url': url,
      'data': data,
      'headers': headers
    });

    // Quick sleep to simulate api call
    await new Promise(resolve => setTimeout(resolve, 2000));

    return new Promise<ApiResponse<T>>((resolve, reject) => {
      if ((data as any).firstName === "Fail") {
        reject({ message: 'Registration Failed!!' });
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
  title: 'Components/Register',
  component: Register,
};

const DefaultTemplate: Story = (args, { argTypes }) => ({
  components: { Register, Notify },
  props: Object.keys(argTypes),
  store,
  template: '<div><notify /><register /></div>'
});

export const Default = DefaultTemplate.bind({});

const RegisteringTemplate: Story = (args, { argTypes }) => ({
  components: { Register },
  props: Object.keys(argTypes),
  store: new Vuex.Store({
    modules: {
      Registration: {
        state: {
          status: RegistrationStatus.Registering
        }
      }
    }
  }),
  template: '<register />'
});

export const Registering = RegisteringTemplate.bind({});

const ThankYouTemplate: Story = (args, { argTypes }) => ({
  components: { Register, Notify },
  props: Object.keys(argTypes),
  store: new Vuex.Store({
    modules: {
      Registration: {
        state: {
          status: RegistrationStatus.Registered
        }
      },
      Notification: {
        state: {
          notifications: [
            {
              header: messages.Registration.Registered.header,
              message: messages.Registration.Registered.message,
              type: AlertType.success,
            },
          ],
        }
      }
    }
  }),
  template: '<div><notify /><register /></div>'
});

export const ThankYou = ThankYouTemplate.bind({});

