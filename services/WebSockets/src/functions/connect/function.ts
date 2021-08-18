import {
  APIGatewayEventDefaultAuthorizerContext,
  APIGatewayEventRequestContextWithAuthorizer,
  APIGatewayProxyHandler,
  APIGatewayAuthorizerResult,
  APIGatewayProxyResult,
  APIGatewayProxyEvent,
} from 'aws-lambda';
import 'source-map-support/register';
import { container } from 'inversify-props';
import bootstrapper from '../../bootstrapper';
import { SaveConnectionCommand } from '../../commands';

import { handler as auth } from '../auth/function';

bootstrapper();

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent, context, callback) => {

  try {

    let { authorizer } = event.requestContext

    if (authorizer === null || authorizer === undefined ) {

      authorizer = await (auth(event, context, callback) as unknown) as APIGatewayAuthorizerResult;

      if (authorizer.policyDocument === undefined) {
        return {
          statusCode: 401,
          body: 'Unauthorized'
        };
      }
    }

    if (authorizer !== null && authorizer.policyDocument.Statement[0].Effect == "Allow") {

      await container.get<SaveConnectionCommand>("SaveConnectionCommand").runAsync({
        userId: authorizer.principalId,
        connectionId: event.requestContext.connectionId as string
      });

      return {
        statusCode: 200,
        body: 'Success'
      };
    }

    return {
      statusCode: 401,
      body: 'Unauthorized'
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: error
    }
  }
};
