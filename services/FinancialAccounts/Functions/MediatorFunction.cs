using System;
using System.IO;
using System.Text;
using System.Threading.Tasks;

using Amazon.Lambda.Core;
using Amazon.Lambda.Serialization.SystemTextJson;

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

using MediatR;

namespace Platform8.FinancialAccounts.Functions
{
  public abstract class MediatorFunction: ServiceFunction
  {

    protected IMediator Mediator
    {
      get
      {
        return Scope.ServiceProvider.GetService<IMediator>();
      }
    }

    protected override void ConfigureServices(IServiceCollection serviceCollection, IConfiguration configuration)
    {
      serviceCollection
        .AddMediatR(FinancialAccounts.Commands.CommandsAssembly.Value);
    }
  }
}
