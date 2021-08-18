import { APIGatewayProxyHandler } from 'aws-lambda';
import { DeleteConnectionCommand } from '../../commands';
import { container } from 'inversify-props';

// TODO: move to config
const CONNECTION_DB_TABLE = process.env.WEBSOCKETS_CONNECTION_DB_TABLE as string;

export const handler: APIGatewayProxyHandler = async (event) => {
  try {

    const response = await container.get<DeleteConnectionCommand>('DeleteConnectionCommand').runAsync({
      connectionId: event.requestContext.connectionId
    });

    if (response.success) {
      return {
        statusCode: 200,
        body: 'Success'
      };
    } else {
      return {
        statusCode: 500,
        body: 'Failed to delete connection.'
      };
    }

  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: error
    }
  }
};
