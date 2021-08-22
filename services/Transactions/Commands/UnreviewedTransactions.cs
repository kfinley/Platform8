using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

using MediatR;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.Model;

using Platform8.Transactions.Models;

namespace Platform8.Transactions.Commands {
  public class UnreviewedTransactionsHandler : IRequestHandler<UnreviewedTransactionsRequest, UnreviewedTransactionsResponse> {
    protected readonly IAmazonDynamoDB dynamoDbClient;
    public UnreviewedTransactionsHandler(IAmazonDynamoDB dynamoDbClient) {
      this.dynamoDbClient = dynamoDbClient;
    }

    public async Task<UnreviewedTransactionsResponse> Handle(UnreviewedTransactionsRequest request, CancellationToken cancellationToken) {
      var query = new QueryRequest {
        TableName = "Transactions",
        IndexName = DynamoConstants.GSI1,
        ExpressionAttributeValues = new Dictionary<string, AttributeValue>
        {
          {":PK", new AttributeValue { S = $"OWNER#{request.OwnerId}" }},
          {":GSI1SK", new AttributeValue { S = $"DATE#{request.StartDate.ToString("o")}" }}
        },
        KeyConditionExpression = "PK = :PK and GSI1SK >= :GSI1SK"
      };

      var data = await this.dynamoDbClient.QueryAsync(query);

      var list = new List<Transaction>();
      //TODO: change to for loop
      data.Items.ForEach(i => {
        var index = data.Items.IndexOf(i);

        // Handle last item in list...
        if (index + 1 == data.Items.Count) {
          // If it's a Transaction then add it. If not then bail.
          if (i.GetValueOrDefault("type")?.S == "Transaction") {
            list.Add(DynamoItemConverters.ConvertItemToTransaction(new DynamoItem(i)));
          }
        }
        // Look ahead one and see if the current transaction has any items.. (if the next item is a Transaction then it has no items...)
        else if (i.GetValueOrDefault("type")?.S == "Transaction" &&
                data.Items[index + 1].GetValueOrDefault("type")?.S == "Transaction") {
          list.Add(DynamoItemConverters.ConvertItemToTransaction(new DynamoItem(i)));
        } else {
          // TODO: implement this...
          // Check if the linked item is 100% of the transaction.
          // Currently it is so skip this item...
          // Should add the transaction with the linked items if amount totals are < 100% of transaction amount.
        }
      });

      return new UnreviewedTransactionsResponse(list);
    }
  }
}
