import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';

import { Command } from '@platform8/commands/src';
import { Inject } from 'inversify-props';
import { GetTransactionRequest, GetTransactionResponse } from './../models';
import { convertItemToTransaction } from './helpers';

export class GetTransactionCommand implements Command<GetTransactionRequest, GetTransactionResponse> {

  @Inject("DynamoDBClient")
  private ddbClient!: DynamoDBClient;

  async runAsync(params: GetTransactionRequest): Promise<GetTransactionResponse> {

    if (params.transaction) {
      // Set the parameters
      const query = {
        TableName: "Transactions",
        IndexName: "GSI1",   
        ExpressionAttributeValues: marshall({
          ":PK": `OWNER#${params.ownerId}`,
          ":GSI1SK": `DATE#${params.transaction.date.toISOString()}ACCOUNT#${params.accountId}AMOUNT#${params.transaction.amount}SEQ#${params.transaction.sequence}`,
          ":description": params.transaction.description
        }),
        KeyConditionExpression: "PK = :PK and begins_with(GSI1SK, :GSI1SK)",
        FilterExpression: "contains (description, :description)",        
      };

      const data = await this.ddbClient.send(new QueryCommand(query));

      if (data.Items && data.Items[0] !== undefined) {
        return {
          data: convertItemToTransaction(data.Items[0]),          
        }
      } else {
        return {};
      }
    } else {
      if (params.id === undefined) {        
        throw new Error("A Transaction or Id must be provided.");        
      }
      const query = {
        TableName: "Transactions",        
        ExpressionAttributeValues: marshall({
          ":PK": `OWNER#${params.ownerId}`,
          ":SK": `TRANSACTION#${params.id}`          
        }),
        KeyConditionExpression: "PK = :PK and begins_with(SK, :SK)"
      };

      const data = await this.ddbClient.send(new QueryCommand(query));

      if (data.Items && data.Items[0] !== undefined) {
        return {
          data: convertItemToTransaction(data.Items[0])
        }
      } else {
        return {};
      }
    }
  }
}
