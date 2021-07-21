import { Inject, injectable } from 'inversify-props';
import { Account, LoadAccountsRequest, LoadAccountsResponse } from '../models';
import { Command } from '@platform8/commands/src';
import { ApiClient } from '@platform8/api-client/src';
import accountsResources from '../resources/accounts';

@injectable()
export class LoadAccountsCommand implements Command<LoadAccountsRequest, LoadAccountsResponse> {

  @Inject('ApiClient')
  private apiClient!: ApiClient;

  public async runAsync(params: LoadAccountsRequest): Promise<LoadAccountsResponse> {
    const response = await this.apiClient.getWithAsync<Account[]>(accountsResources.accounts, params);

    if (response.status === 200) {
      return {
        accounts: response.data
      };
    }

    throw new Error(`Add account failed. Error: ${response.data}`);
  }
}
