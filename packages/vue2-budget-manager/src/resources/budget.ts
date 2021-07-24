import { config } from '@platform8/config/src';

let budgetsServiceUri = config.Api;

if (config.ApiPorts && config.ApiPorts.includes('budget')) {
  const port = config.ApiPorts.split(',').find(x => x.startsWith('budget:'))?.split(':')[1];
  budgetsServiceUri = `${budgetsServiceUri}:${port}`;
  console.log(`Budgets Service: ${budgetsServiceUri}`);
}

export default {
  get serviceBasePath() {
    return `${budgetsServiceUri}/budgets/v1`
  },

  get budget() {
    return `${this.serviceBasePath}`;
  },

  get category() {
    return `${this.serviceBasePath}/category`;
  },
}
