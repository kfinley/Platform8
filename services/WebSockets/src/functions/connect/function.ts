import {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
} from 'aws-lambda';
import 'source-map-support/register';
import { container } from 'inversify-props';
import bootstrapper from '../../bootstrapper';
import { SaveConnectionCommand } from '../../commands';
import { createResponse } from '../../createResponse';

bootstrapper();

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent, context, callback) => {
  try {

    let { authorizer } = event.requestContext

    if (authorizer === null || authorizer === undefined || authorizer.policyDocument === undefined) {
      return createResponse(event, 401, 'Unauthorized');
    }

    if ((authorizer !== null || authorizer === undefined) && authorizer.policyDocument.Statement[0].Effect == "Allow") {

      await container.get<SaveConnectionCommand>("SaveConnectionCommand").runAsync({
        userId: authorizer.principalId,
        connectionId: event.requestContext.connectionId as string
      });
      return createResponse(event, 200, 'Success');
    }
    return createResponse(event, 401, 'Unauthorized');

  } catch (error) {
    console.log(error);
    return createResponse(event, 500, error as string);
  }
};
