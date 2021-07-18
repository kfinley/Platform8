using System;
using System.IO;

using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

using Platform8.Core;

namespace Platform8.FinancialAccounts.Api
{
  public class Program
  {
    public static void Main(string[] args)
    {
      CreateHostBuilder(args).Build().Run();
    }

    public static IHostBuilder CreateHostBuilder(string[] args) =>
    Host.CreateDefaultBuilder(args)
        .ConfigureWebHostDefaults(webBuilder =>
        {
          webBuilder.ConfigureAppConfiguration(cb =>
          {
            var env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

            cb.SetBasePath(Directory.GetCurrentDirectory());
            cb.AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);

            if (env.HasValue())
            {
              cb.AddJsonFile($"appsettings.{env}.json", optional: true);
            }

            cb.AddEnvironmentVariables();
          })
          .UseStartup<Startup>();
        });
  }
}