import { Inject, injectable } from 'inversify-props';
import { LoadExpensesRequest, LoadExpensesResponse } from '../models';
import { Command } from '@platform8/commands/src';
import { ApiClient } from '@platform8/api-client/src';
import expensesResources from '../resources/expenses';

@injectable()
export class LoadExpensesCommand implements Command<LoadExpensesRequest, LoadExpensesResponse> {

  @Inject('ApiClient')
  private apiClient!: ApiClient;

  public async runAsync(request: LoadExpensesRequest): Promise<LoadExpensesResponse> {
    const response = await this.apiClient.postAsync<LoadExpensesResponse>(expensesResources.expense, request);

    if (response.status === 200) {
      return response.data;
    }

    throw new Error(`Add expense failed. Error: ${response.data.error}`);
  }
}