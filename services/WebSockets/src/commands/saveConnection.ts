
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { Command } from '@platform8/commands/src';
import { Inject } from 'inversify-props';
import { convertRequestToItem } from './helpers';

export interface SaveConnectionRequest {
  connectionId: string | undefined
}

export interface SaveConnectionResponse {
  success: boolean
}

export class SaveConnection implements Command<SaveConnectionRequest, SaveConnectionResponse> {

  @Inject("DynamoDBClient")
  private ddbClient!: DynamoDBClient;

  async runAsync(params: SaveConnectionRequest): Promise<SaveConnectionResponse> {

    const ownerId = '';
    const token = '';

    const Item = convertRequestToItem(params.connectionId as string, ownerId, token);

    var response = await this.ddbClient.send(new PutItemCommand({
      TableName: 'Users', //TODO: deal with this...
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
