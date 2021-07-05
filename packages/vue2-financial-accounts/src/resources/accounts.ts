import { config } from '@platform8/config/src';

const accountsServiceUri = config.Api;

export default {
  get serviceBasePath() {
    return `${accountsServiceUri}/financial-accounts/v1`
  },

  get account() {
    return `${this.serviceBasePath}/account`;
  }

}

