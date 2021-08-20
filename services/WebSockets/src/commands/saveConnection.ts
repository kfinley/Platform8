
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { Command } from '@platform8/commands/src';
import { Inject } from 'inversify-props';
import { DeleteConnectionByUserIdCommand } from '.';
import { convertRequestToItem } from './helpers';

const CONNECTION_TABLE = process.env.WEBSOCKETS_CONNECTION_TABLE as string;

export interface SaveConnectionRequest {
  userId: string;
  connectionId: string;
}

export interface SaveConnectionResponse {
  success: boolean
}

export class SaveConnectionCommand implements Command<SaveConnectionRequest, SaveConnectionResponse> {

  @Inject("DynamoDBClient")
  private ddbClient!: DynamoDBClient;

  @Inject("DeleteConnectionByUserIdCommand")
  private deleteConnectionByUserId!: DeleteConnectionByUserIdCommand;

  async runAsync(params: SaveConnectionRequest): Promise<SaveConnectionResponse> {

    // Delete any existing connection.
    //TODO: rework this to allow multi-device connections
    await this.deleteConnectionByUserId.runAsync({
      userId: params.userId
    });

    const Item = convertRequestToItem(params);

    var response = await this.ddbClient.send(new PutItemCommand({
      TableName: CONNECTION_TABLE,
      Item
    }));

    if (response.$metadata.httpStatusCode !== 200) {
      throw new Error("Unexpected response in SaveConnection");
    }

    return {
      success: true
    }
  }
}
