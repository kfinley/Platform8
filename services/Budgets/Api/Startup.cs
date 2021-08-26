using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

using Platform8.Budgets.Data;

namespace Platform8.Budgets.Api {
  public class Startup : WebApi.StartupBase {
    public Startup(IConfiguration configuration)
      : base(configuration) {
      base.ServiceName = "Budgets";
      base.MediatorAssembly = Budgets.Commands.CommandsAssembly.Value;
    }

    public void ConfigureServices(IServiceCollection services) {
      base.ConfigureCoreServices<BudgetsDataContext>(services);
      services.AddAutoMapper(Budgets.Commands.CommandsAssembly.Value);
    }
  }
}
