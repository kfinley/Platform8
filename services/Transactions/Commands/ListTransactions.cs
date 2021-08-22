using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

using MediatR;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.Model;

using Platform8.Transactions.Models;

namespace Platform8.Transactions.Commands
{
  public class ListTransactionsHandler : IRequestHandler<ListTransactionsRequest, ListTransactionsResponse>
  {
    protected readonly IAmazonDynamoDB dynamoDbClient;
    public ListTransactionsHandler(IAmazonDynamoDB dynamoDbClient)
    {
      this.dynamoDbClient = dynamoDbClient;
    }

    public async Task<ListTransactionsResponse> Handle(ListTransactionsRequest request, CancellationToken cancellationToken)
    {
      var query = new QueryRequest
      {
        TableName = "Transactions",
        IndexName = DynamoConstants.GSI1,
        ExpressionAttributeValues = new Dictionary<string, AttributeValue>
        {
          {":PK", new AttributeValue { S = $"OWNER#{request.OwnerId}" }},
          {":GSI1SK", new AttributeValue { S = $"DATE#{request.StartDate.ToString("o")}ACCOUNT" }}
        },
        KeyConditionExpression = "PK = :PK and GSI1SK >= :GSI1SK"
      };

      var data = await this.dynamoDbClient.QueryAsync(query);

      var list = new List<Transaction>();

      data.Items.ForEach(i => list.Add(DynamoItemConverters.ConvertItemToTransaction(new DynamoItem(i))));

      return new ListTransactionsResponse(list);
    }
  }
}
