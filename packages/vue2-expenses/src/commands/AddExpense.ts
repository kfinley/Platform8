import { Inject, injectable } from 'inversify-props';
import { AddExpenseRequest, AddExpenseResponse } from '../models';
import { Command } from '@platform8/commands/src';
import { ApiClient } from '@platform8/api-client/src';
import expensesResources from '../resources/expenses';

@injectable()
export class AddExpenseCommand implements Command<AddExpenseRequest, AddExpenseResponse> {

  @Inject('ApiClient')
  private apiClient!: ApiClient;

  public async runAsync(request: AddExpenseRequest): Promise<AddExpenseResponse> {
    const response = await this.apiClient.postAsync<AddExpenseResponse>(expensesResources.expense, request);

    if (response.status === 200) {
      return response.data;
    }

    throw new Error(`Add expense failed. Error: ${response.data.error}`);
  }
}
