import { ApiClient, apiClient } from '@platform8/api-client/src';
import { Container, container } from 'inversify-props';
import { AddCategoryCommand } from './commands';

export default function bootstrapper() {
  addTransientIfNeeded<ApiClient>(apiClient, 'ApiClient', container);
  addTransientIfNeeded<AddCategoryCommand>(AddCategoryCommand, "AddCategoryCommand", container);
}

function addTransientIfNeeded<T>(constructor: any, id: string, container: Container) {
  if (!container.isBound(id)) {
    container.addTransient<T>(constructor, id);
  }
}