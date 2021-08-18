
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { Command } from '@platform8/commands/src';
import { Inject } from 'inversify-props';
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

  async runAsync(params: SaveConnectionRequest): Promise<SaveConnectionResponse> {

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
