import { AttributeValue } from "@aws-sdk/client-dynamodb";
import { SaveConnectionRequest } from "./saveConnection";

export function convertRequestToItem(request: SaveConnectionRequest): {
  [key: string]: AttributeValue;
} | undefined {

  return {
    userId: {
      S: request.userId
    },
    connectionId: {
      S: request.connectionId
    }
  }
}
