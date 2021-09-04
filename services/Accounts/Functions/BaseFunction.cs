using Amazon.SimpleNotificationService;

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;

using MediatR;

using ServiceProviderFunctions;
using EFQuerySpecs;

using Platform8.Accounts.Data;

namespace Platform8.Accounts.Functions
{
  public abstract class BaseFunction : ServiceProviderFunction
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
