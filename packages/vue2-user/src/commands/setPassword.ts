import { SetPasswordRequest, SetPasswordResponse } from '../types';
import { Command } from '@platform8/commands/src';
import { Inject } from 'inversify-props';
import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { config } from "@platform8/config/src";

export class SetPasswordCommand implements Command<SetPasswordRequest, SetPasswordResponse> {

  @Inject('CognitoIdentityProvider')
  private provider!: CognitoIdentityProvider;

  public async runAsync(params: SetPasswordRequest): Promise<SetPasswordResponse> {

    if (params.session !== undefined) {

      const request = {
        ClientId: config.ClientId,
        ChallengeName: "NEW_PASSWORD_REQUIRED",
        ChallengeResponses: {
          USERNAME: params.username,
          NEW_PASSWORD: params.proposedPassword,
        },
        Session: params.session
      }

      try {
        var result = await this.provider.respondToAuthChallenge(request);
        if (result.AuthenticationResult) {
          return {
            success: true,
            authenticationResult: {
              accessToken: result.AuthenticationResult.AccessToken,
              expiresIn: result.AuthenticationResult.ExpiresIn,
              tokenType: result.AuthenticationResult.TokenType,
              refreshToken: result.AuthenticationResult.RefreshToken,
              idToken: result.AuthenticationResult.IdToken
            },
          }
        }
      } catch (e) {
        throw new Error(`Failed to set password. Error: ${e.message}`);
      }
    }

    return {
      success: false,
      error: "Failed to set password"
    };
  }
}

