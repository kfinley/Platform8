
import { DynamoDBClient, DeleteItemCommand, ScanCommand, AttributeValue } from '@aws-sdk/client-dynamodb';
import { Command } from '@platform8/commands/src';
import { Inject } from 'inversify-props';

const CONNECTION_TABLE = process.env.WEBSOCKETS_CONNECTION_TABLE as string;

export interface DeleteConnectionRequest {
  userId?: string;
  connectionId?: string;
}

export interface DeleteConnectionResponse {
  success: boolean
}

export class DeleteConnectionCommand implements Command<DeleteConnectionRequest, DeleteConnectionResponse> {

  @Inject("DynamoDBClient")
  private ddbClient!: DynamoDBClient;

  async runAsync(params: DeleteConnectionRequest): Promise<DeleteConnectionResponse> {

    let { userId, connectionId } = params;

    if (!userId || !connectionId) {
      const response = await this.ddbClient.send(new ScanCommand({
        TableName: CONNECTION_TABLE,
        ExpressionAttributeValues: {
          ':connectionId': { S: params.connectionId as string }
        },
        ProjectionExpression: 'userId, connectionId',
        FilterExpression: 'connectionId = :connectionId'
      }));
      if (response.$metadata.httpStatusCode !== 200) {
        throw new Error("Unexpected response in DeleteConnection");
      }

      if (response.Items) {
        const item = response.Items[0]
        userId = item.userId.S;
        connectionId = item.connectionId.S;
      } else {
        return {
          success: false
        };
      }
    }

    var response = await this.ddbClient.send(new DeleteItemCommand({
      TableName: CONNECTION_TABLE,
      Key: {
        userId: {
          S: userId as string
        },
        connectionId: {
          S: connectionId as string
        }
      }
    }));

    if (response.$metadata.httpStatusCode !== 200) {
      throw new Error("Unexpected response in DeleteConnection");
    }

    console.log('deleted websocket connection');

    return {
      success: true
    };
  }
}
