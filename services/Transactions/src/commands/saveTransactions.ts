import { DynamoDBClient, AttributeValue, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { Command } from '@platform8/commands/src';
import { Inject } from 'inversify-props';
import { SaveTransactionsRequest, SaveTransactionsResponse, Transaction } from "../models";
import { GetTransactionCommand } from "./getTransaction";

export class SaveTransactionsCommand implements Command<SaveTransactionsRequest, SaveTransactionsResponse> {

  @Inject("DynamoDBClient")
  private ddbClient!: DynamoDBClient;

  @Inject("GetTransactionCommand")
  private getTransactionCommand!: GetTransactionCommand;

  async runAsync(params: SaveTransactionsRequest): Promise<SaveTransactionsResponse> {

    let count = params.transactions.length;
    let saved = 0;

    for (let i = 0; i < count; i++) {
      var existingTransaction = await this.getTransactionCommand.runAsync({
        userId: params.userId,
        accountId: params.accountId,
        transaction: params.transactions[i]
      })

      if (existingTransaction.data === undefined) {
        const Item = this.convertTransactionToItem(params.userId, params.accountId, params.transactions[i]);
        await this.ddbClient.send(new PutItemCommand({
          TableName: 'Transactions',
          Item
        }));
        saved++;
      } else {
        console.log('Transaction exists');
      }
    }

    return {
      count,
      saved,
      success: true
    };
  }

  convertTransactionToItem(userId: string, accountId: string, transaction: Transaction): {
    [key: string]: AttributeValue;
  } | undefined {
    return {
      PK: {
        S: `USER#${userId}`
      },
      SK: {
        S: `ACCOUNT#${accountId}|DATE#${transaction.date.toISOString()}|AMOUNT#${transaction.amount}|TRANSACTION#${transaction.id}`
      },
      type: {
        S: 'Transaction'
      },
      id: {
        S: transaction.id as string
      },
      description: {
        S: transaction.description
      },
      date: {
        S: transaction.date.toString()
      },
      amount: {
        N: transaction.amount.toString()
      }
    }
  }
}
