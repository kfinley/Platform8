import { AttributeValue } from "@aws-sdk/client-dynamodb";

export function convertRequestToItem(ownerId: string, connectionId: string, token: string) : {
  [key: string]: AttributeValue;
} | undefined {
  const date = new Date().toISOString();

  return {
    PK: {
      S: `OWNER#${ownerId}`
    },
    SK: {
      S: `TOKEN#${token}DATE#${date}`
    },
    connectionId: {
      S: connectionId
    },
    date: {
      S: date
    }

  }
}
