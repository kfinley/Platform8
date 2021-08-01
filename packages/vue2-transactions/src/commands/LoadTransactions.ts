import { Inject } from 'inversify-props';
import { LoadTransactionsRequest, LoadTransactionsResponse, Transaction, TransactionStatus } from '../models';
import { Command } from '@platform8/commands/src';
import { ApiClient, ApiResponse } from '@platform8/api-client/src';
import transactionResources from "../resources/transactions";

export class LoadTransactionsCommand implements Command<LoadTransactionsRequest, LoadTransactionsResponse> {

  @Inject('ApiClient')
  private apiClient!: ApiClient;

  async runAsync(params: LoadTransactionsRequest): Promise<LoadTransactionsResponse> {

    let response: ApiResponse<Transaction[]>;
    // Remove status from request and use it to decide which endpoint to use.
    const {status, ...requestParams } = params;
      
    if (status === TransactionStatus.Unreviewed) {
      response = await this.apiClient.getWithAsync<Transaction[]>(transactionResources.unreviewedTransactions, requestParams);
    } else {
      response = await this.apiClient.getWithAsync<Transaction[]>(transactionResources.transactions, requestParams);      
    }
    
    if (response.status === 200) {
      return {
        transactions: response.data
      };
    }

    throw new Error(`Load transactions failed. Error: ${response.data}`);
  }
}
