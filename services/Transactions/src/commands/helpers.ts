import { LinkedItem, Transaction } from "@/models";
import { AttributeValue } from "@aws-sdk/client-dynamodb";

export function convertItemToTransaction(item: Record<string, AttributeValue> | undefined): Transaction {

  if (item === undefined) {
    throw new Error("item is undefined");
  }

  return {
    id: item.id.S as string,
    date: new Date(item.date.S as string),
    description: item.description.S as string,
    amount: Number.parseFloat(item.amount.N as string) as number,
    accountId: item.accountId.S as string
  }
}

export function convertTransactionToItem(ownerId: string, accountId: string, transaction: Transaction): {
  [key: string]: AttributeValue;
} | undefined {
  return {
    PK: {
      S: `OWNER#${ownerId}`
    },
    SK: {
      S: `TRANSACTION#${transaction.id}`
    },
    GSI1SK: {
      S: `DATE#${transaction.date.toISOString()}ACCOUNT#${accountId}AMOUNT#${transaction.amount}`
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
      S: transaction.date.toISOString()
    },
    amount: {
      N: transaction.amount.toString()
    },
    accountId: {
      S: accountId
    }
  }
}

export function convertLinkedItemToItem(ownerId: string, transaction: Transaction, linkedItem: LinkedItem): {
  [key: string]: AttributeValue;
} | undefined {

  let attributes: Record<string, AttributeValue> = {};
  
  //Guard to ensure all attributes are camel case.
  const toCamelCase = (str: string) => str.charAt(0).toLowerCase() + str.slice(1);

  Object.keys(linkedItem.attributes).forEach((key) => {
    attributes[toCamelCase(key)] = {
      S: linkedItem.attributes[key].toString()
    }
  });

  let item = {
    PK: {
      S: `OWNER#${ownerId}`
    },
    SK: {
      S: `ITEM#${linkedItem.id}TRANSACTION#${transaction.id}`
    },
    GSI1SK: {
      S: `DATE#${transaction.date}`
    },
    type: {
      S: 'LinkedItem'
    },
    id: {
      S: linkedItem.id as string
    },
    ...attributes
  }

  return item;
}

export function convertItemToLinkedItem(item: Record<string, AttributeValue> | undefined): LinkedItem {

  if (item === undefined) {
    throw new Error("item is undefined");
  }
  let attributes: Record<string, string> = {};

  Object.keys(item).forEach((key) =>
    attributes[key] = item[key].S as string
  );

  return {
    id: item.id.S as string,
    attributes
  }
}
