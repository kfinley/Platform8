import { ApiClient, apiClient } from '@platform8/api-client/src';
import { container } from 'inversify-props';
import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { LoginCommand, SetPasswordCommand, RegisterCommand } from "./commands";

export default function bootstrapper() {

  container.bind<CognitoIdentityProvider>("CognitoIdentityProvider")
    .toDynamicValue(() => new CognitoIdentityProvider({
      endpoint: "http://localhost:9229"
    }));

  // container.bind<CognitoIdentityProvider>("CognitoIdentityProvider")
  //   .toDynamicValue(() => new CognitoIdentityProvider({
  //     region: "us-west-1"
  //   }));

  container.addTransient<ApiClient>(apiClient, 'ApiClient');
  container.addTransient<LoginCommand>(LoginCommand, "LoginCommand");
  container.addTransient<RegisterCommand>(RegisterCommand, "RegisterCommand");
  container.addTransient<SetPasswordCommand>(SetPasswordCommand, "SetPasswordCommand");
}
