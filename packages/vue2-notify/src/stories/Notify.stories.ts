import Vuex from 'vuex';
import { Story } from '@storybook/vue/types-6-0';
import { action } from '@storybook/addon-actions';
import Notify from '@/components/Notify.vue';
import { setupModules } from '@/plugin';
import { AlertType } from '@/types';

let store = new Vuex.Store<any>({});
setupModules(store);

store.subscribe((m, s) => {
  action(m.type)(m.payload);
});

store.subscribeAction((a, s) => {
  action(a.type)(a.payload);
});

store.state.Notification.notifications = [
  {
    header: 'Success!!!',
    message: 'This is a success message.',
    type: AlertType.success
  },
  {
    header: 'Error!',
    message: 'This is an error message.',
    type: AlertType.danger
  },
  {
    header: 'Warning',
    message: 'This is a warning message.',
    type: AlertType.warning
  },
  {
    header: 'Info',
    message: 'This is an info message.',
    type: AlertType.info
  }
];

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
