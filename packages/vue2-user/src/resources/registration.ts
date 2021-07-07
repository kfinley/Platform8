import { config } from '@platform8/config/src';

let registrationServiceUri = config.Api;

if (config.ApiPorts && config.ApiPorts.includes('user')) {
  const port = config.ApiPorts.split(',').find(x => x.startsWith('user'))?.split(':')[1];
  registrationServiceUri = `${registrationServiceUri}:${port}`;
  console.log(`User Service: ${registrationServiceUri}`);
}

export default {
  get serviceBasePath() {
    return `${registrationServiceUri}/user/v1`
  },

  get register() {
    return `${this.serviceBasePath}/register`;
  }

}

