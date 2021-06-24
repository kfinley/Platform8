import Vuex from 'vuex';
import { Story } from '@storybook/vue/types-6-0';
import { action } from '@storybook/addon-actions';
import Notify from '@/components/Notify.vue';
import { setupModules } from '@/plugin';
import { AlertType } from '@/types';

let store = new Vuex.Store({});
setupModules(store);

export default {
  title: 'Components/Notify',
  component: Notify
}

const DefaultTemplate: Story = (args, { argTypes }) => ({
  components: { Notify },
  props: Object.keys(argTypes),
  store,
  template: '<notify />'
});

export const Default = DefaultTemplate.bind({});

const SuccessTemplate: Story = (args, { argTypes }) => ({
  components: { Notify },
  props: Object.keys(argTypes),
  store: new Vuex.Store({
    modules: {
      Notification: {
        state: {
          notifications: [
            {
              header: 'Success!!',
              message: 'This is a success message.',
              type: AlertType.success
            },
            {
              header: 'Error!!',
              message: 'This is an error message.',
              type: AlertType.danger
            }
          ]
        }
      }
    }
  }),
  template: '<notify />'
});

export const Success = SuccessTemplate.bind({});
