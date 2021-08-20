import { DynamoDBClient, DeleteItemCommand } from '@aws-sdk/client-dynamodb';
import { Command } from '@platform8/commands/src';
import { Inject } from 'inversify-props';
import { GetConnectionByUserIdCommand } from './';
import { DeleteConnectionRequest, DeleteConnectionResponse } from '../models';

const CONNECTION_TABLE = process.env.WEBSOCKETS_CONNECTION_TABLE as string;

export class DeleteConnectionByUserIdCommand implements Command<DeleteConnectionRequest, DeleteConnectionResponse> {

  @Inject("DynamoDBClient")
  private ddbClient!: DynamoDBClient;

  @Inject("GetConnectionByUserIdCommand")
  private getConnectionByUserId!: GetConnectionByUserIdCommand;

  async runAsync(params: DeleteConnectionRequest): Promise<DeleteConnectionResponse> {

    console.log('DeleteConnectionByUserId', params);

    let { userId } = params;

    if (userId) {
      const existingConnection = await this.getConnectionByUserId.runAsync({
        userId
      });

      if (existingConnection.connectionId) {
        var response = await this.ddbClient.send(new DeleteItemCommand({
          TableName: CONNECTION_TABLE,
          Key: {
            userId: {
              S: userId
            },
            connectionId: {
              S: existingConnection.connectionId
            }
          }
        }));
        if (response.$metadata.httpStatusCode !== 200) {
          throw new Error("Unexpected response in DeleteConnection");
        }
        console.log('deleted websocket connection');
      }
    }
    return {
      success: true
    };
  }
}
