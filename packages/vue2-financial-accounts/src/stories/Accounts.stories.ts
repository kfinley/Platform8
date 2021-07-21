import Vuex from 'vuex';
import { Story } from '@storybook/vue/types-6-0';
import Accounts from "@/components/Accounts.vue";
import { AccountsStatus, initializeModules } from '@/store';
import { initializeModules as initializeNotifications } from "@platform8/vue2-notify/src/store";
import { Notify } from "@platform8/vue2-notify/src/components";
import { AddAccountRequest, AddAccountResponse } from '@/models';
import { Command } from '@platform8/commands/src';
import { AddAccountCommand } from '@/commands';
import { container, injectable } from 'inversify-props';
import NotificationModule from '@platform8/vue2-notify/src/store/notificationModule';
import { AccountsModule } from '@/store/accountsModule';

let store = new Vuex.Store({
  plugins: [
    initializeModules,
    initializeNotifications,
  ],
  modules: {
    "Notification": NotificationModule,
    "Accounts": AccountsModule,
  }
});

@injectable()
class mockAddAccountCommand implements Command<AddAccountRequest, AddAccountResponse> {
  public async runAsync(login: AddAccountRequest): Promise<AddAccountResponse> {
    // Quick sleep to simulate api call
    await new Promise(resolve => setTimeout(resolve, 2000));

    return new Promise(resolve => {
      resolve({
        success: true
      } as AddAccountResponse)
    });
  }
}

container.addTransient<AddAccountCommand>(mockAddAccountCommand, "AddAccountCommand");

export default {
  title: 'Components/Accounts',
  component: Accounts,
};

const DefaultTemplate: Story = (args, { argTypes }) => ({
  components: { Accounts, Notify },
  store,
  template: '<div><notify /><accounts /></div>'
});

export const Default = DefaultTemplate.bind({});

const LoadingTemplate: Story = (args, { argTypes }) => ({
  components: { Accounts },
  store: new Vuex.Store({
    modules: {
      Accounts: {
        state: {
          accountsStatus: AccountsStatus.Loading,
          accounts: [],
        }
      }
    }
  }),
  template: '<accounts />'
});

export const Loading = LoadingTemplate.bind({});


