using System.Threading.Tasks;
using Amazon.Lambda.Core;
using Platform8.FinancialAccounts.Models;

namespace Platform8.FinancialAccounts.Functions
{
  public class AccountBalanceNotification : DataContextFunction
  {
    public async Task Handler(AddBalanceRequest @event, ILambdaContext context) => await base.Mediator.Send(@event);
  }
}
