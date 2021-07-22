import { config } from '@platform8/config/src';

let budgetServiceUri = config.Api;

if (config.ApiPorts && config.ApiPorts.includes('budget')) {
  const port = config.ApiPorts.split(',').find(x => x.startsWith('budget:'))?.split(':')[1];
  budgetServiceUri = `${budgetServiceUri}:${port}`;
  console.log(`Financial Accounts Service: ${budgetServiceUri}`);
}

export default {
  get serviceBasePath() {
    return `${budgetServiceUri}/budget/v1`
  },

  get category() {
    return `${this.serviceBasePath}/category`;
  },
}
