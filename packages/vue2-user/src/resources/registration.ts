import { config } from '@platform8/config/src';

const registrationServiceUri = config.Api;

export default {
  get serviceBasePath() {
    return `${registrationServiceUri}/user/v1`
  },

  get register() {
    return `${this.serviceBasePath}/register`;
  }

}

