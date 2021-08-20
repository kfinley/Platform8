import { APIGatewayProxyEvent } from "aws-lambda";

export function createResponse(event: APIGatewayProxyEvent, statusCode: number, body: string) {

  let response = {
    statusCode,
    body
  };

  if (event.requestContext.eventType === 'CONNECT') {
    return {
      ...response,
      headers: {
        'Sec-WebSocket-Protocol': event.headers['Sec-WebSocket-Protocol'] as string
      }
    }
  }
  return response;
};
