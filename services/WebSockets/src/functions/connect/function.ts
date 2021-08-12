import {
  APIGatewayEventDefaultAuthorizerContext,
  APIGatewayEventRequestContextWithAuthorizer,
  APIGatewayProxyHandler,
  APIGatewayAuthorizerResult,
  APIGatewayProxyResult,
} from 'aws-lambda';
import 'source-map-support/register';
import { container } from 'inversify-props';
import bootstrapper from '@/bootstrapper';
import { SaveConnection } from '@/commands';

import { handler as authorizer } from '@/functions/auth/function';

bootstrapper();

export const handler: APIGatewayProxyHandler = async (event, context, callback) => {

  try {
    console.log(event);
    if (event.requestContext.authorizer === undefined) {
      const authorizerResponse = await (authorizer(event, context, callback) as unknown) as APIGatewayAuthorizerResult;

      if (authorizerResponse.policyDocument !== undefined) {
        return authorizerResponse as unknown as APIGatewayProxyResult;
      }
      return {
        statusCode: 500,
        body: 'ERROR!! \n authorizerResponse empty'
      };
    }

    const saveConnection = await container.get<SaveConnection>("SaveConnection").runAsync({
      connectionId: event.requestContext.connectionId
    });

    return {
      statusCode: 200,
      body: 'Success'
    };

  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: error
    }
  }
};
