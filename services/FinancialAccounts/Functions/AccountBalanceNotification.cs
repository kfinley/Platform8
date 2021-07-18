using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Amazon.Lambda.Core;
using Amazon.Lambda.SNSEvents;

// Assembly attribute to enable the Lambda function's JSON input to be converted into a .NET class.
[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]

namespace Platform8.FinancialAccounts.Functions
{
  public class AccountBalanceNotification
  {
    public async Task Handler(object @event, ILambdaContext context)
    {
      //TODO: Next step is save the new balance notification to the database
      context.Logger.LogLine($"AccountBalanceNotification sns event record {@event}");
    }

  }
}
