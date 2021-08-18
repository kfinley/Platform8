
import { DynamoDBClient, DeleteItemCommand } from '@aws-sdk/client-dynamodb';
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

    /*

    //TODO: fix this... it's not going to work as is... just getting compiled and running

    If userId is passed in lookup by key.
    If connectionid is passed in then find the connection and delete it.

    */

    var response = await this.ddbClient.send(new DeleteItemCommand({
      TableName: CONNECTION_TABLE,
      Key: {
        userId: {
          S: params.userId as string
        }
      }
    }));

    if (response.$metadata.httpStatusCode !== 200) {
      throw new Error("Unexpected response in DeleteConnection");
    }

    return {
      success: true
    }
  }
}
