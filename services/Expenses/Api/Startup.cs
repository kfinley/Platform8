using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

using Amazon.SimpleNotificationService;

using MediatR;

using Platform8.Expenses.Data;

namespace Platform8.Expenses.Api {
  public class Startup : WebApi.StartupBase {
    public Startup(IConfiguration configuration)
      : base(configuration) {
      base.ServiceName = "Expenses";
      base.MediatorAssembly = Expenses.Commands.CommandsAssembly.Value;
    }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services) {

      base.ConfigureCoreServices<DataContext>(services);

      services.AddAWSService<IAmazonSimpleNotificationService>(Configuration.GetAWSOptions("Service:SNS"))
      .AddMediatR(Aws.Commands.CommandsAssembly.Value)
      .AddAutoMapper(Expenses.Commands.CommandsAssembly.Value);

    }
  }
}
