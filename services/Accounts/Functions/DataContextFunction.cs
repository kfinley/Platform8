using System;
using System.Configuration;
using System.IO;
using System.Text;
using System.Threading.Tasks;

using Amazon.Lambda.Core;
using Amazon.Lambda.Serialization.SystemTextJson;

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;

using MediatR;

using Platform8.Core.Data;
using Platform8.Accounts.Data;

namespace Platform8.Accounts.Functions
{
  public abstract class DataContextFunction : MediatorFunction
  {
    protected override void ConfigureServices(IServiceCollection serviceCollection, IConfiguration configuration)
    {
      serviceCollection
        .AddOptions()
        .AddDefaultAWSOptions(configuration.GetAWSOptions())
        .AddDbContext<AccountsDataContext>(options =>
          options.UseMySql(configuration.GetConnectionString("DefaultConnection")))
        .AddScoped(typeof(IAsyncRepository<,>), typeof(AsyncRepository<,>));

      base.ConfigureServices(serviceCollection, configuration);
    }
  }
}
