using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

using Platform8.Accounts.Data;

namespace Platform8.Accounts.Api {
  public class Startup : WebApi.StartupBase {

    public Startup(IConfiguration configuration)
      : base(configuration) {
      base.ServiceName = "Accounts";
      base.MediatorAssembly = Accounts.Commands.CommandsAssembly.Value;
    }
    public void ConfigureServices(IServiceCollection services) =>
      base.ConfigureCoreServices<AccountsDataContext>(services);
  }
}
