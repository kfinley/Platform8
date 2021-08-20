import { ApiGatewayManagementApiClient } from '@aws-sdk/client-apigatewaymanagementapi';
import { PostToConnectionCommand } from '@aws-sdk/client-apigatewaymanagementapi';
import { Command } from '@platform8/commands/src';
import { Inject } from 'inversify-props';

export interface SendMessageRequest {
  connectionId: string;
  data: string | Uint8Array | undefined;
}

export interface SendMessageResponse {
  statusCode?: number
}

export class SendMessageCommand implements Command<SendMessageRequest, SendMessageResponse> {

  @Inject("ApiGatewayManagementApiClient")
  private client!: ApiGatewayManagementApiClient;

  async runAsync(params: SendMessageRequest): Promise<SendMessageResponse> {

    const output = await this.client.send(new PostToConnectionCommand({
      ConnectionId: params.connectionId,
      Data: params.data as any
    }));

    return {
      statusCode: output.$metadata.httpStatusCode
    }
  }
}
