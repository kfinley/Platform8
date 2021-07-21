import { AttributeValue, DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';

import { Command } from '@platform8/commands/src';
import { Inject } from 'inversify-props';
import { GetTransactionRequest, GetTransactionResponse, Transaction } from './../models';

export class GetTransactionCommand implements Command<GetTransactionRequest, GetTransactionResponse> {

  @Inject("DynamoDBClient")
  private ddbClient!: DynamoDBClient;

  async runAsync(params: GetTransactionRequest): Promise<GetTransactionResponse> {
    if (params.transaction) {
      // Set the parameters
      const query = {
        TableName: "Transactions",        
        ExpressionAttributeValues: marshall({
          ":PK": `USER#${params.userId}`,
          ":SK": `ACCOUNT#${params.accountId}AMOUNT#${params.transaction.amount}`,
          ":description": params.transaction.description,
          ":date": params.transaction.date.toISOString()
        }),
        KeyConditionExpression: "PK = :PK and begins_with(SK, :SK)",
        FilterExpression: "contains (description, :description) and #date = :date",
        ExpressionAttributeNames: { "#date": "date" }
      };

      const data = await this.ddbClient.send(new QueryCommand(query));

      if (data.Items && data.Items[0] !== undefined) {
        return {
          data: convertItemToTransaction(data.Items[0])
        }
      } else {
        return {};
      }
    } else {
      //TODO: load transaction by id
    }

    throw new Error('Method not implemented.');
  }

}
function convertItemToTransaction(item: { [key: string]: AttributeValue; }): Transaction {

  return {
    id: item.id.S as string,
    date: new Date(item.date.S as string),
    description: item.description.S as string,
    amount: Number.parseFloat(item.amount.N as string) as number
  }
}

