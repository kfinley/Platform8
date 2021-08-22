using System;
using System.Configuration;
using System.IO;
using System.Text;
using System.Threading.Tasks;

using Amazon.Lambda.Core;
using Amazon.Lambda.Serialization.SystemTextJson;
using Amazon.SimpleNotificationService;

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;

using MediatR;

using Platform8.Core.Data;
using Platform8.Accounts.Data;

namespace Platform8.Accounts.Functions
{
  public abstract class BaseFunction : ServiceFunction
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
        .AddOptions()
        .AddDefaultAWSOptions(configuration.GetAWSOptions())
        .AddAWSService<IAmazonSimpleNotificationService>(configuration.GetAWSOptions("Service:SNS"))
        .AddDbContext<AccountsDataContext>(options =>
          options.UseMySql(configuration.GetConnectionString("DefaultConnection")))
        .AddScoped(typeof(IAsyncRepository<,>), typeof(AsyncRepository<,>))
        .AddMediatR(Aws.Commands.CommandsAssembly.Value)
        .AddMediatR(Accounts.Commands.CommandsAssembly.Value);;
    }
  }
}
