import { RegistrationRequest, RegistrationResponse } from '../types';
import { Command } from '@platform8/commands/src';
import { ApiClient } from '@platform8/api-client/src';
import registrationResources from '../resources/registration';

export class RegisterCommand implements Command<RegistrationRequest, RegistrationResponse> {

  private apiClient!: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  public async runAsync(registration: RegistrationRequest): Promise<RegistrationResponse> {
    const response = await this.apiClient.postAsync<RegistrationResponse>(registrationResources.register, registration);

    if (response.status === 200) {
      return response.data;
    }

    throw new Error(`Registration failed. Error: ${response.data.error}`);
  }
}
