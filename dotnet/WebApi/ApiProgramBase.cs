using System;
using System.IO;

using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;

using Platform8.Core;

namespace Platform8.WebApi {

  public abstract class ApiProgramBase {
    protected static void Run<TStartup>(string[] args)
      where TStartup : class  => CreateHostBuilder<TStartup>(args).Build().Run();

    protected static IHostBuilder CreateHostBuilder<TStartup>(string[] args)
      where TStartup : class =>

    Host.CreateDefaultBuilder(args)
       .ConfigureWebHostDefaults(webBuilder => {
         webBuilder.ConfigureAppConfiguration(cb => {
           var env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

           cb.SetBasePath(Directory.GetCurrentDirectory());
           cb.AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);

           if (env.HasValue()) {
             cb.AddJsonFile($"appsettings.{env}.json", optional: true);
           }

           cb.AddEnvironmentVariables();
         })
         .UseStartup<TStartup>();
       });
  }
}
