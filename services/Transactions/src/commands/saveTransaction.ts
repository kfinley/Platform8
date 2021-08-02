import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { Command } from '@platform8/commands/src';
import { Inject } from 'inversify-props';
import { Transaction } from "../models";
import { GetTransactionCommand } from "./getTransaction";
import { convertItemToTransaction, convertTransactionToItem } from "./helpers";
import * as uuid from "uuid";

export interface SaveTransactionRequest {
  ownerId: string;
  accountId: string;
  transaction: Transaction;
}

export interface SaveTransactionResponse {
  data?: Transaction;
  success: boolean;
  error?: string;
}

export class SaveTransactionCommand implements Command<SaveTransactionRequest, SaveTransactionResponse> {

  @Inject("DynamoDBClient")
  private ddbClient!: DynamoDBClient;

  @Inject("GetTransactionCommand")
  private getTransactionCommand!: GetTransactionCommand;

  async runAsync(params: SaveTransactionRequest): Promise<SaveTransactionResponse> {

    if (params.transaction.id) {
      throw new Error("Not implemented");
    } else {
      var existingTransaction = await this.getTransactionCommand.runAsync({
        ownerId: params.ownerId,
        accountId: params.accountId,
        transaction: params.transaction
      });
      if (existingTransaction.data) {
        return {
          success: false,
          error: 'Transaction exists'
        }
      }
      params.transaction.id = uuid.v4();
      const Item = convertTransactionToItem(params.ownerId, params.accountId, params.transaction);
      var response = await this.ddbClient.send(new PutItemCommand({
        TableName: 'Transactions',
        Item
      }));
      if (response.$metadata.httpStatusCode !== 200) {
        throw new Error("Unexpected response in SaveTransaction");
      }
    }

    return {
      data: params.transaction,
      success: true
    };

  }
}
