import { config } from '@platform8/config/src';

let expensesServiceUri = config.Api;

if (config.ApiPorts && config.ApiPorts.includes('expenses')) {
  const port = config.ApiPorts.split(',').find(x => x.startsWith('expenses:'))?.split(':')[1];
  expensesServiceUri = `${expensesServiceUri}:${port}`;
  console.log(`Expenses Service: ${expensesServiceUri}`);
}

export default {
  get serviceBasePath() {
    return `${expensesServiceUri}/expenses/v1`
  },

  get expense() {
    return `${this.serviceBasePath}`;
  }
}
