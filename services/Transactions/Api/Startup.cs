using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

using Amazon.DynamoDBv2;

namespace Platform8.Transactions.Api {
  public class Startup : WebApi.StartupBase {
    public Startup(IConfiguration configuration)
      : base(configuration) {
      base.ServiceName = "Transactions";
      base.MediatorAssembly = Transactions.Commands.CommandsAssembly.Value;
    }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services) {
      base.ConfigureCoreServices(services);

      // Add DynamoDb client config
      services.AddSingleton<IAmazonDynamoDB>(sp => {
        var clientConfig = new AmazonDynamoDBConfig { ServiceURL = Configuration.GetValue<string>("Service:DynamoDB:ServiceURL") };
        return new AmazonDynamoDBClient(clientConfig);
      });
    }
  }
}
