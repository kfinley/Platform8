using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

using Amazon.Lambda.Core;

using Platform8.FinancialAccounts.Models;

namespace Platform8.FinancialAccounts.Functions
{
  public class AccountBalanceNotification : DataContextFunction
  {
    protected override void ConfigureServices(IServiceCollection serviceCollection, IConfiguration configuration) {
      base.ConfigureServices(serviceCollection, configuration);
    }

    public async Task Handler(AddBalanceRequest @event, ILambdaContext context) => await this.Mediator.Send(@event);
  }
}
