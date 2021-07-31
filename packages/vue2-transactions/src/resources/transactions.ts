import { config } from '@platform8/config/src';

let serviceUri = config.Api;

if (config.ApiPorts && config.ApiPorts.includes('transactions')) {
  const port = config.ApiPorts.split(',').find(x => x.startsWith('transactions:'))?.split(':')[1];
  serviceUri = `${serviceUri}:${port}`;
  console.log(`Financial Transactions Service: ${serviceUri}`);
}

export default {
  get serviceBasePath() {
    return `${serviceUri}/transactions/v1`
  },

  get transactions() {
    return `${this.serviceBasePath}`;
  }
}

