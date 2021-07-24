import { Inject, injectable } from 'inversify-props';
import { GetBudgetRequest, GetBudgetResponse } from '../models';
import { Command } from '@platform8/commands/src';
import { ApiClient } from '@platform8/api-client/src';
import budgetResources from '../resources/budget';

@injectable()
export class GetBudgetCommand implements Command<GetBudgetRequest, GetBudgetResponse> {

  @Inject('ApiClient')
  private apiClient!: ApiClient;

  public async runAsync(request: GetBudgetRequest): Promise<GetBudgetResponse> {
    
    const response = await this.apiClient.getAsync<GetBudgetResponse>(budgetResources.budget);
    
    if (response.status === 200) {
      return response.data;
    }

    throw new Error(`Get budget failed. Error: ${response.data.error}`);
  }
}
