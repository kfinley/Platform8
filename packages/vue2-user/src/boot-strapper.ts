import { ApiClient, apiClient } from '@platform8/api-client/src';
import { container } from 'inversify-props';

export default function bootstrapper() {
  container.addTransient<ApiClient>(apiClient, 'ApiClient');
}
