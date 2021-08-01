import * as uuid from "uuid";
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { Command } from '@platform8/commands/src';
import { Inject } from 'inversify-props';
import { LinkedItem, Transaction } from "../models";
import { convertItemToLinkedItem, convertLinkedItemToItem } from './helpers';

export interface SaveLinkedItemRequest {
  ownerId: string;
  transaction: Transaction;
  linkedItem: {
    id?: string;
    attributes: Record<string, any>;
  }
}

export interface SaveLinkedItemResponse {
  data: LinkedItem;
  success: boolean;
  error?: string;
}

export class SaveLinkedItemCommand implements Command<SaveLinkedItemRequest, SaveLinkedItemResponse> {

  @Inject("DynamoDBClient")
  private ddbClient!: DynamoDBClient;


  async runAsync(params: SaveLinkedItemRequest): Promise<SaveLinkedItemResponse> {

    if (params.linkedItem.id) {
      throw new Error("Not implemented");
    } else {
      params.linkedItem.id = uuid.v4();

      if (params.transaction.linkedItems === undefined) {
        params.transaction.linkedItems = [];
      }

      const Item = convertLinkedItemToItem(params.ownerId, params.transaction,
      {
        id: uuid.v4(),
        attributes: params.linkedItem
      });

      var response = await this.ddbClient.send(new PutItemCommand({
        TableName: 'Transactions',
        Item
      }));

      if (response.$metadata.httpStatusCode !== 200) {
        throw new Error("Unexpected response in SaveLinkedItem");
      }
    }

    return {
      data: params.linkedItem,
      success: true
    }
  }
}
