using System.Threading.Tasks;
using Amazon.Lambda.Core;
using Platform8.Accounts.Models;

namespace Platform8.Accounts.Functions {
  public class AccountBalanceNotification : BaseFunction {
    public async Task Handler(AddBalanceRequest @event, ILambdaContext context) => await base.Mediator.Send(@event);
  }
}
