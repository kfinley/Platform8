import { ApiClient, apiClient } from '@platform8/api-client/src';
import { Container, container } from 'inversify-props';
import { AddExpenseCommand } from './commands/AddExpense';

export default function bootstrapper() {
  addTransientIfNeeded<ApiClient>(apiClient, 'ApiClient', container);
  addTransientIfNeeded<AddExpenseCommand>(AddExpenseCommand, 'AddExpenseCommand', container);
}

function addTransientIfNeeded<T>(constructor: any, id: string, container: Container) {
  if (!container.isBound(id)) {
    container.addTransient<T>(constructor, id);
  }
}
