import { config } from '@platform8/config/src';

let accountsServiceUri = config.Api;

if (config.ApiPorts && config.ApiPorts.includes('accounts')) {
  const port = config.ApiPorts.split(',').find(x => x.startsWith('accounts:'))?.split(':')[1];
  accountsServiceUri = `${accountsServiceUri}:${port}`;
  console.log(`Accounts Service: ${accountsServiceUri}`);
}

export default {
  get serviceBasePath() {
    return `${accountsServiceUri}/accounts/v1`
  },

  get account() {
    return `${this.serviceBasePath}/account`;
  },

  get accounts() {
    return `${this.serviceBasePath}`;
  },

}

