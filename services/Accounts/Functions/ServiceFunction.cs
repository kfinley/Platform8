using System;
using System.IO;
using System.Text;
using System.Threading.Tasks;

using Amazon.Lambda.Core;
using Amazon.Lambda.Serialization.SystemTextJson;

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

// Assembly attribute to enable the Lambda function's JSON input to be converted into a .NET class.
[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]

namespace Platform8.Accounts.Functions {
  //
  // Based on concepts from https://www.c-sharpcorner.com/article/dependency-injection-with-serverless-functions/
  // This implementation unwraps the static readonly Lazy<IServiceProvider> provided in the article into
  // seperate static instances and methods in order to leverage OO inheritance for injecting dependencies
  // into the ServiceCollection from a child class. This is accomplished by overriding the ConfigureServices
  // method in the Lambda function Handler class.
  //
  // The PostConfigureServices property can also be used to inject services or more importantly modify the
  // ServiceCollection AFTER the overriden ConfigureServices method is called. This can be used for testing
  // in order to replace dependencides with mock / test implementations. Here is an example of replacing an
  // IAuthProvider with a TestProvider used duing test code execution.
  //
  // function.PostConfigureServices = (sc) => {
  //    sc.RemoveAt(sc.IndexOf(sc.First(s => s.ServiceType == typeof(IAuthProvider))));
  //    sc.AddTransient<IAuthProvider, TestProvider>();
  //  };
  //
  public abstract class ServiceFunction {
    protected ServiceFunction() {
      ServiceFunction.lazyServiceProvider = new Lazy<IServiceProvider>(BuildServiceProvider);
    }

    private static Lazy<IServiceProvider> lazyServiceProvider;
    protected IServiceScope Scope => lazyServiceProvider.Value.CreateScope();

    private static string EnvironmentName = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production";

    protected IConfigurationBuilder ConfigurationBuilder() {
      // standard .Net ConfigurationBuilder boilerplate
      return new ConfigurationBuilder()
        .SetBasePath(Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().Location))
        .AddJsonFile("appsettings.json", false)
        .AddJsonFile($"appsettings.{EnvironmentName}.json", optional: true)
        .AddEnvironmentVariables();
    }

    protected abstract void ConfigureServices(IServiceCollection serviceCollection, IConfiguration configuration);

    public Action<IServiceCollection> PostConfigureServices { get; set; }

    private IServiceCollection ServiceCollection(IConfiguration configuration) {
      var sc = new ServiceCollection();
      sc
        .AddLogging(lb => {
          lb.AddConfiguration(configuration.GetSection("Logging"));
          lb.AddConsole();
        })
        .AddDefaultAWSOptions(configuration.GetAWSOptions())
        .AddOptions()
        .AddTransient<ILambdaSerializer, DefaultLambdaJsonSerializer>();
      return sc;
    }

    private IServiceProvider BuildServiceProvider() {
      var config = ConfigurationBuilder().Build();
      var collection = ServiceCollection(config);
      ConfigureServices(collection, config);
      PostConfigureServices?.Invoke(collection);
      var serviceProvider = collection.BuildServiceProvider();
      return serviceProvider;
    }
  }
}
