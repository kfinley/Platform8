import { GetUserDetailsRequest, GetUserDetailsResponse } from "@/types";
import { CognitoIdentityProvider } from "@aws-sdk/client-cognito-identity-provider";
import { Command } from "@platform8/commands/src";
import { Inject } from "inversify-props";

export class GetUserDetailsCommand implements Command<GetUserDetailsRequest, GetUserDetailsResponse> {

  @Inject('CognitoIdentityProvider')
  private provider!: CognitoIdentityProvider;

  async runAsync(params: GetUserDetailsRequest): Promise<GetUserDetailsResponse> {
    const user = await this.provider.getUser({
      AccessToken: params.accessToken
    });

    return {
      username: user.Username as string,
      firstName: user.UserAttributes?.find(a => a.Name == "given_name")?.Value as string,
      lastName: user.UserAttributes?.find(a => a.Name == "family_name")?.Value as string,
      email: user.UserAttributes?.find(a => a.Name == "email")?.Value as string
    };
  }
}
