using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

using Amazon.CognitoIdentityProvider;
using Amazon.SimpleEmail;

using Platform8.User.Data;
using Platform8.User.Models;

namespace Platform8.User.Api {
  public class Startup : WebApi.StartupBase {
    public Startup(IConfiguration configuration)
      : base(configuration) {
      base.ServiceName = "User";
      base.MediatorAssembly = Commands.CommandsAssembly.Value;
    }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services) {

      base.ConfigureCoreServices<UserDataContext>(services);

      services
        .Configure<SiteOptions>(Configuration.GetSection("Service:Site"))
        .Configure<CognitoOptions>(Configuration.GetSection("Service:Cognito"))
        .Configure<ContactOptions>(Configuration.GetSection("Service:ContactInfo"))
        .AddAWSService<IAmazonCognitoIdentityProvider>(Configuration.GetAWSOptions("Service:Cognito"))
        .AddAWSService<IAmazonSimpleEmailService>(Configuration.GetAWSOptions("Service:SES"));
    }
  }
}
