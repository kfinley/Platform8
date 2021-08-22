using System;
using System.Collections.Generic;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

using Amazon.CognitoIdentityProvider;
using Amazon.SimpleEmail;

using ContinuousMigrations;
using MediatR;

using Platform8.Core;
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

        .AddScoped(typeof(IAsyncRepository<>), typeof(AsyncRepository<>))

        .AddMediatR(Commands.CommandsAssembly.Value);

      //
      // *****************************

      services
        .AddAuthentication(options =>
        {
          options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
          options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
          // Validate using issuer public keys
          var serviceURL = Configuration.GetValue<string>("Service:Cognito:ServiceURL");
          var poolId = Configuration.GetValue<string>("Service:Cognito:PoolId");
          var clientId = Configuration.GetValue<string>("Service:Cognito:ClientId");

          options.TokenValidationParameters = new TokenValidationParameters
          {
            // https://stackoverflow.com/a/53244447
            ValidateIssuerSigningKey = true,
            IssuerSigningKeyResolver = (s, securityToken, identifier, parameters) =>
            {
              // get JsonWebKeySet from AWS
              var json = new System.Net.WebClient().DownloadString(parameters.ValidIssuer + "/.well-known/jwks.json");

              // serialize the result (JsonSerializer fails to deserialize so using Newtonsoft for now)
              var keys = Newtonsoft.Json.JsonConvert.DeserializeObject<JsonWebKeySet>(json).Keys;

              // cast the result to be the type expected by IssuerSigningKeyResolver
              return (IEnumerable<SecurityKey>)keys;
            },

            ValidIssuer = $"{serviceURL}/{poolId}",
            // For local dev we're skipping validation of issuer b/c it doesn't work with cognito-local
#if DEBUG
            ValidateIssuer = false,
#else
            ValidateIssuer = true,
#endif

            LifetimeValidator = (before, expires, token, param) => expires > SystemTime.UtcNow,
            ValidateLifetime = true,

            ValidAudience = clientId,
            ValidateAudience = false   // TODO: check this...

          };
        });

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
