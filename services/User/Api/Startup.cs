using System;

using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using Microsoft.EntityFrameworkCore;

using Amazon.CognitoIdentityProvider;
using Amazon.Runtime;
using Amazon.SimpleEmail;

using ContinuousMigrations;
using MediatR;

using Platform8.Core.Data;
using Platform8.User.Data;
using Platform8.User.Models;

namespace Platform8.User.Api
{
  public class Startup
  {
    public Startup(IConfiguration configuration)
    {
      Configuration = configuration;
    }

    public IConfiguration Configuration { get; }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services)
    {

      // User Service Specific setup
      //

      services
        .AddOptions()
        .AddDefaultAWSOptions(Configuration.GetAWSOptions())
        .Configure<SiteOptions>(Configuration.GetSection("Service:Site"))
        .Configure<CognitoOptions>(Configuration.GetSection("Service:Cognito"))
        .Configure<ContactOptions>(Configuration.GetSection("Service:ContactInfo"))
        .AddAWSService<IAmazonCognitoIdentityProvider>(Configuration.GetAWSOptions("Service:Cognito"))
        .AddAWSService<IAmazonSimpleEmailService>(Configuration.GetAWSOptions("Service:SES"))
        .AddDbContext<UserDataContext>(options =>
          options.UseMySql(Configuration.GetConnectionString("DefaultConnection"),
                           new MySqlServerVersion(new Version(5, 7)),
                           x => x.MigrationsAssembly("User.Api")))
        .AddContinuousMigrations<UserDataContext>()

        .AddScoped(typeof(IAsyncRepository<,>), typeof(AsyncRepository<,>))

        .AddMediatR(Commands.CommandsAssembly.Value);

      //
      // *****************************


      services.AddControllers();
      services.AddCors();
      services.AddSwaggerGen(c =>
      {
        c.SwaggerDoc("v1", new OpenApiInfo { Title = "Platform8 User Api", Version = "v1" });
      });
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
      if (env.IsDevelopment())
      {
        app.UseDeveloperExceptionPage();
        app.UseSwagger();
        app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Platform8 User Api v1"));
      }

      app.UseRouting();

      app.UseCors(builder => builder
        //TODO: Secure this...
        // This will allow any origin
        .SetIsOriginAllowed(origin => true)
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials());

      app.UseAuthorization();

      app.UseEndpoints(endpoints =>
      {
        endpoints.MapControllers();
      });
    }
  }
}
