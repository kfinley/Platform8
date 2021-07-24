import { config } from '@platform8/config/src';

let budgetServiceUri = config.Api;

if (config.ApiPorts && config.ApiPorts.includes('budget')) {
  const port = config.ApiPorts.split(',').find(x => x.startsWith('budget:'))?.split(':')[1];
  budgetServiceUri = `${budgetServiceUri}:${port}`;
  console.log(`Budget Service: ${budgetServiceUri}`);
}

export default {
  get serviceBasePath() {
    return `${budgetServiceUri}/budget/v1`
  },

  get budget() {
    return `${this.serviceBasePath}`;
  },

  get category() {
    return `${this.serviceBasePath}/category`;
  },
}
