import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { Command } from '@platform8/commands/src';
import { Inject } from 'inversify-props';
import { SaveTransactionsRequest, SaveTransactionsResponse, Transaction } from "../models";
import { SaveTransactionCommand } from './saveTransaction';

export class SaveTransactionsCommand implements Command<SaveTransactionsRequest, SaveTransactionsResponse> {

  @Inject("DynamoDBClient")
  private ddbClient!: DynamoDBClient;

  @Inject("SaveTransactionCommand")
  private saveTransactionCommand!: SaveTransactionCommand;

  async runAsync(params: SaveTransactionsRequest): Promise<SaveTransactionsResponse> {

    let count = params.transactions.length;
    let saved = 0;

    for (let i = 0; i < count; i++) {
      var result = await this.saveTransactionCommand.runAsync({
        ownerId: params.ownerId,
        accountId: params.accountId,
        transaction: params.transactions[i]
      });
      
      if (result.success) {
        saved++;
      } else {
        console.log(result.error);
      }
    }

    return {
      count,
      saved,
      success: true
    };
  }
}
