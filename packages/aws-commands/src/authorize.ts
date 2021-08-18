import { Inject } from 'inversify-props';
import { Command } from '@platform8/commands/src';
import { CognitoIdentityProvider, AttributeType } from "@aws-sdk/client-cognito-identity-provider";

export interface AuthorizeRequest {
  authHeader: string;
}

export interface AuthorizeResponse {
  username: string;
  attributes?: Record<string, string>;
  authorized: boolean;
}

export class AuthorizeCommand implements Command<AuthorizeRequest, AuthorizeResponse> {

  @Inject('CognitoIdentityProvider')
  private provider!: CognitoIdentityProvider;

  async runAsync(params: AuthorizeRequest): Promise<AuthorizeResponse> {

    // 'Basic dGVzdDpwYXNzd29yZA=='
    const idAndToken = Buffer.from(params.authHeader.split(' ')[1], 'base64').toString()
    const [username, token] = idAndToken.split(':');

    const user = await this.provider.getUser({
      AccessToken: token
    });

    return {
      username,
      attributes: this.attributesToRecord(user.UserAttributes),
      authorized: true
    }
  }

  attributesFromRecord(
    attributes: Record<string, string>
  ): readonly AttributeType[] {
    return Object.entries(attributes).map(([Name, Value]) => ({ Name, Value }));
  }

  attributesToRecord(
    attributes: readonly AttributeType[] | undefined
  ): Record<string, string> {
    return (attributes || []).reduce(
      (acc, attr) => ({ ...acc, [attr.Name as string]: attr.Value }),
      {}
    );
  }
}
