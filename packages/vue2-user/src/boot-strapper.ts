import { ApiClient, apiClient } from '@platform8/api-client/src';
import { Container, container } from 'inversify-props';
import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { LoginCommand, SetPasswordCommand, RegisterCommand } from "./commands";

export default function bootstrapper() {

  if (!container.isBound("CognitoIdentityProvider")) {
    container.bind<CognitoIdentityProvider>("CognitoIdentityProvider")
      .toDynamicValue(() => new CognitoIdentityProvider({
        endpoint: "http://localhost:9229"
      }));
  }
  
  // container.bind<CognitoIdentityProvider>("CognitoIdentityProvider")
  //   .toDynamicValue(() => new CognitoIdentityProvider({
  //     region: "us-west-1"
  //   }));

  addTransientIfNeeded<ApiClient>(apiClient, 'ApiClient', container);
  addTransientIfNeeded<LoginCommand>(LoginCommand, "LoginCommand", container);
  addTransientIfNeeded<RegisterCommand>(RegisterCommand, "RegisterCommand", container);
  addTransientIfNeeded<SetPasswordCommand>(SetPasswordCommand, "SetPasswordCommand", container);
}

function addTransientIfNeeded<T>(constructor: any, id: string, container: Container) {
  if (!container.isBound(id)) {
    container.addTransient<T>(constructor, id);
  }
}