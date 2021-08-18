import {
  APIGatewayEventDefaultAuthorizerContext,
  APIGatewayEventRequestContextWithAuthorizer,
  APIGatewayProxyHandler,
  APIGatewayAuthorizerResult,
  APIGatewayProxyResult,
} from 'aws-lambda';
import 'source-map-support/register';
import { container } from 'inversify-props';
import bootstrapper from '../../bootstrapper';
import { SaveConnectionCommand } from '../../commands';

import { handler as auth } from '../auth/function';

bootstrapper();

export const handler: APIGatewayProxyHandler = async (event, context, callback) => {

  try {

    let { authorizer } = event.requestContext

    if (authorizer === undefined) {

      authorizer = await (auth(event, context, callback) as unknown) as APIGatewayAuthorizerResult;

      if (authorizer.policyDocument === undefined) {
        return {
          statusCode: 401,
          body: 'Unauthorized'
        };
      }
    }

    if (authorizer !== null && authorizer.policyDocument.Statement[0].Effect == "Allow") {

      console.log('authorized!');
      await container.get<SaveConnectionCommand>("SaveConnectionCommand").runAsync({
        userId: authorizer.principalId,
        connectionId: event.requestContext.connectionId as string
      });
    } else {
      console.log('unauthorized');
      return {
        statusCode: 401,
        body: 'Unauthorized'
      };
    }

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
