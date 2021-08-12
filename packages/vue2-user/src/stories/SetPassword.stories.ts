import Vuex from 'vuex';
import { Story } from '@storybook/vue/types-6-0';
import SetPassword from "@/components/SetPassword.vue";
import { LoginRequest, LoginResponse } from '@/types';
import { AuthStatus } from '@/store';
import { setupModules } from '@/plugin';
import { setupModules as setupNotificationModule } from "@platform8/vue2-notify/src/plugin";
import { Notify } from "@platform8/vue2-notify/src/components";
import { Command } from '@platform8/commands/src';
import { container, injectable } from 'inversify-props';
import { LoginCommand } from "../commands";

@injectable()
class mockLoginCommand implements Command<LoginRequest, LoginResponse> {
  public async runAsync(login: LoginRequest): Promise<LoginResponse> {
    return new Promise(resolve => {
      return {
        status: AuthStatus.NewPasswordRequired,
        session: "result.Session"
      }
    });
  }
}

container.addTransient<LoginCommand>(mockLoginCommand, "LoginCommand");

let store = new Vuex.Store({});
setupNotificationModule(store);
setupModules(store);

export default {
  title: 'Components/SetPassword',
  component: SetPassword,
};

const DefaultTemplate: Story = (args, { argTypes }) => ({
  components: { SetPassword, Notify },
  props: Object.keys(args),
  store: new Vuex.Store({
    modules: {
      User: {
        state: {
          authStatus: AuthStatus.NewPasswordRequired
        }
      },
      Notification: {
        state: {
          notifications: []
        }
      }
    }
  }),
  template: '<div><notify /><set-password v-bind="$props"/></div>'
});

export const Default = DefaultTemplate.bind({})
Default.args = {
  regCode: "userId|tempPassword"
};

const SettingPasswordTemplate: Story = (args, { argTypes }) => ({
  components: { SetPassword, Notify },
  props: Object.keys(args),
  store: new Vuex.Store({
    modules: {
      User: {
        state: {
          authStatus: AuthStatus.SettingPassword
        }
      },
      Notification: {
        state: {
          notifications: [],
        }
      },
    }
  }),
  template: '<div><notify /><set-password v-bind="$props"/></div>'
});

export const SettingPassword = SettingPasswordTemplate.bind({});
SettingPassword.args = {
  regCode: "userId|tempPassword"
};
