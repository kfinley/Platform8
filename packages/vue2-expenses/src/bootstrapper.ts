import { ApiClient, apiClient } from '@platform8/api-client/src';
import { Container, container } from 'inversify-props';
import { AddExpenseCommand, LoadExpensesCommand } from './commands';

export default function bootstrapper() {
  addTransientIfNeeded<ApiClient>(apiClient, 'ApiClient', container);
  addTransientIfNeeded<AddExpenseCommand>(AddExpenseCommand, 'AddExpenseCommand', container);
  addTransientIfNeeded<LoadExpensesCommand>(LoadExpensesCommand, 'LoadExpensesCommand', container);
}

function addTransientIfNeeded<T>(constructor: any, id: string, container: Container) {
  if (!container.isBound(id)) {
    container.addTransient<T>(constructor, id);
  }
}
