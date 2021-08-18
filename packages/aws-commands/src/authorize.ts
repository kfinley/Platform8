import { Inject } from 'inversify-props';
import { Command } from '@platform8/commands/src';
import { CognitoIdentityProvider } from "@aws-sdk/client-cognito-identity-provider";

export interface AuthorizeRequest {
  token: string;
}

export interface AuthorizeResponse {
  success: boolean;
}

export class AuthorizeCommand implements Command<AuthorizeRequest, AuthorizeResponse> {

  @Inject('CognitoIdentityProvider')
  private provider!: CognitoIdentityProvider;

  async runAsync(params: AuthorizeRequest): Promise<AuthorizeResponse> {
    const user = await this.provider.getUser({
      AccessToken: params.token
    });
    
    return {
      success: true
    }
  }
}
