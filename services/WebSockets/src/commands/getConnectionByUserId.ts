import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { Command } from '@platform8/commands/src';
import { Inject } from 'inversify-props';

const CONNECTION_TABLE = process.env.WEBSOCKETS_CONNECTION_TABLE as string;

export interface GetConnectionRequest {
  userId: string;
}

export interface GetConnectionResponse {
  connectionId?: string;
  success: boolean
}

export class GetConnectionByUserIdCommand implements Command<GetConnectionRequest, GetConnectionResponse> {

  @Inject("DynamoDBClient")
  private ddbClient!: DynamoDBClient;

  async runAsync(params: GetConnectionRequest): Promise<GetConnectionResponse> {

    const query = {
      TableName: CONNECTION_TABLE,
      ExpressionAttributeValues: marshall({
        ":userId": params.userId,
      }),
      KeyConditionExpression: "userId = :userId"
    };

    const data = await this.ddbClient.send(new QueryCommand(query));

    if (data.Items && data.Count && data.Count > 0) {
      return {
        connectionId: data.Items[0].connectionId.S as string,
        success: true
      }
    }

    console.log('No connection found...');

    return {
      success: false
    };
  }
}
