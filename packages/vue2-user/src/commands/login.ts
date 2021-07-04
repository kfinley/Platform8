import { AuthStatus, LoginRequest, LoginResponse } from '../types';
import { Command } from '@platform8/commands/src';
import { Inject } from 'inversify-props';
import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { config } from "@platform8/config/src";

export class LoginCommand implements Command<LoginRequest, LoginResponse> {

  @Inject('CognitoIdentityProvider')
  private provider!: CognitoIdentityProvider;

  public async runAsync(login: LoginRequest): Promise<LoginResponse> {

    const request = {
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: config.ClientId,
      AuthParameters: {
        USERNAME: login.email,
        PASSWORD: login.password
      }
    }

    try {

      var result = await this.provider.initiateAuth(request);
      if (result.AuthenticationResult) {
        return {
          status: AuthStatus.LoggedIn,
          authenticationResult: {
            accessToken: result.AuthenticationResult.AccessToken,
            expiresIn: result.AuthenticationResult.ExpiresIn,
            tokenType: result.AuthenticationResult.TokenType,
            refreshToken: result.AuthenticationResult.RefreshToken,
            idToken: result.AuthenticationResult.IdToken
          },
        }
      }
      if (result.ChallengeName == "NEW_PASSWORD_REQUIRED") {
        return {
          status: AuthStatus.NewPasswordRequired,
          session: result.Session
        }
      }
    } catch (e) {
      const message = `Login failed. Error: ${e.message}`;
      if (e.message === 'Resource not found') {
        console.log('Confirm Cognito UserPool ClientID is correct.', e);
      }
      throw new Error(message);
    }

    return {
      status: AuthStatus.LoginFailed,
      error: "login failed"
    };

  }
}
