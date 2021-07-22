import { Inject, injectable } from 'inversify-props';
import { AddCategoryRequest, AddCategoryResponse } from '../models';
import { Command } from '@platform8/commands/src';
import { ApiClient } from '@platform8/api-client/src';
import budgetResources from '../resources/budget';

@injectable()
export class AddCategoryCommand implements Command<AddCategoryRequest, AddCategoryResponse> {

  @Inject('ApiClient')
  private apiClient!: ApiClient;

  public async runAsync(request: AddCategoryRequest): Promise<AddCategoryResponse> {
    const response = await this.apiClient.postAsync<AddCategoryResponse>(budgetResources.category, request);

    if (response.status === 200) {
      return response.data;
    }

    throw new Error(`Add category failed. Error: ${response.data.error}`);
  }
}
