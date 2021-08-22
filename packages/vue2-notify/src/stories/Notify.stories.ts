import Vuex from "vuex";
import { Story } from "@storybook/vue/types-6-0";
import { action } from "@storybook/addon-actions";
import Notify from "@/components/Notify.vue";
import { setupModules } from "@/plugin";
import { AlertType } from "@/types";

const loremIpsum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

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
    header: "Success!!!",
    message: "This is a success message.",
    type: AlertType.success,
  },
  {
    header: "Error!",
    message: "This is an error message.",
    type: AlertType.danger,
  },
  {
    header: "Warning",
    message: "This is a warning message.",
    type: AlertType.warning,
  },
  {
    header: "Info",
    message: "This is an info message.",
    type: AlertType.info,
  },
];

export default {
  title: "Components/Notify/Notify",
  component: Notify,
};

const DefaultTemplate: Story = (args, { argTypes }) => ({
  components: { Notify },
  props: Object.keys(argTypes),
  store,
  template: "<notify />",
});

export const Default = DefaultTemplate.bind({});

const HoverTemplate: Story = (args, { argTypes }) => ({
  components: { Notify },
  props: Object.keys(argTypes),
  store,
  template: `<div style="padding: 1em;"><notify /><p>${loremIpsum}</p><p>${loremIpsum}</p><p>${loremIpsum}</p></div>`
});

export const Hover = HoverTemplate.bind({});
