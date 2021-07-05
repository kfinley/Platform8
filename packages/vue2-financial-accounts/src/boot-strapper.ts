import { ApiClient, apiClient } from '@platform8/api-client/src';
import { container } from 'inversify-props';
import { AddAccountCommand } from "./commands";

export default function bootstrapper() {
  container.addTransient<ApiClient>(apiClient, 'AccountsApiClient');
  container.addTransient<AddAccountCommand>(AddAccountCommand, "AddAccountCommand");
}
