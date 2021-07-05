import Vuex from 'vuex';
import { Story } from '@storybook/vue/types-6-0';
import Accounts from "@/components/Accounts.vue";
import { initializeModules } from '@/store';
import { setupModules as setupNotificationModule } from "@platform8/vue2-notify/src/plugin";
import { Notify } from "@platform8/vue2-notify/src/components";
import { AddAccountRequest, AddAccountResponse } from '@/models';
import { Command } from '@platform8/commands/src';
import { AddAccountCommand } from '@/commands';
import { container, injectable } from 'inversify-props';

let store = new Vuex.Store({});
setupNotificationModule(store);
initializeModules(store);

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

