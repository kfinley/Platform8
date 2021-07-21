import { Inject } from 'inversify-props';
import { LoadTransactionsRequest, LoadTransactionsResponse, Transaction } from '../models';
import { Command } from '@platform8/commands/src';
import { ApiClient } from '@platform8/api-client/src';
import transactionResources from "../resources/transactions";

export class LoadTransactionsCommand implements Command<LoadTransactionsRequest, LoadTransactionsResponse> {

  @Inject('ApiClient')
  private apiClient!: ApiClient;

  async runAsync(params: LoadTransactionsRequest): Promise<LoadTransactionsResponse> {

    const response = await this.apiClient.getWithAsync<Transaction[]>(transactionResources.transactions, params);

    if (response.status === 200) {
      return {
        transactions: response.data
      };
    }

    throw new Error(`Add account failed. Error: ${response.data}`);
  }
}
