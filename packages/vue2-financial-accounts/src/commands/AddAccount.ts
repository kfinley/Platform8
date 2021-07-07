import { Inject, injectable } from 'inversify-props';
import { AddAccountRequest, AddAccountResponse } from '../models';
import { Command } from '@platform8/commands/src';
import { ApiClient } from '@platform8/api-client/src';
import accountsResources from '../resources/accounts';

@injectable()
export class AddAccountCommand implements Command<AddAccountRequest, AddAccountResponse> {

  @Inject('AccountsApiClient')
  private apiClient!: ApiClient;

  public async runAsync(account: AddAccountRequest): Promise<AddAccountResponse> {
    const response = await this.apiClient.postAsync<AddAccountResponse>(accountsResources.account, account);

    if (response.status === 200) {
      return response.data;
    }

    throw new Error(`Add account failed. Error: ${response.data.error}`);
  }
}
