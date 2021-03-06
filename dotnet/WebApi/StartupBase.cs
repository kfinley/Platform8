using System;
using System.Collections.Generic;
using System.Reflection;
using System.Text.Json;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

using ContinuousMigrations;
using MediatR;

using EFQuerySpecs;
using Platform8.Core;

namespace Platform8.WebApi {

  public abstract class StartupBase {

    public StartupBase(IConfiguration configuration) {
      this.Configuration = configuration;
    }

    public IConfiguration Configuration { get; }
    protected string ServiceName { get; set; }
    protected Assembly MediatorAssembly { get; set; }

    private void AddDataContext<DbContext>(IServiceCollection services)
      where DbContext : Microsoft.EntityFrameworkCore.DbContext {

      services.AddDbContext<DbContext>(options =>
          options.UseMySql(Configuration.GetConnectionString("DefaultConnection"),
                           new MySqlServerVersion(new Version(5, 7)),
                           x => x.MigrationsAssembly($"{this.ServiceName}.Api"))

#if DEBUG
                  // TODO: investigate.. Shouldn't have to add this b/c of the AddLogging config above.
                  .UseLoggerFactory(LoggerFactory.Create(builder => builder.AddConsole()))
                  .EnableSensitiveDataLogging()
#endif
        )
        .AddContinuousMigrations<DbContext>();
    }

    private void AddCoreServices(IServiceCollection services) {

      services
        .AddOptions()
        .AddLogging(loggingBuilder => {
          loggingBuilder.AddConfiguration(Configuration.GetSection("Logging"));
          loggingBuilder.AddConsole();
          loggingBuilder.AddDebug();
        });

      services
        .AddDefaultAWSOptions(Configuration.GetAWSOptions())

        .AddScoped(typeof(IAsyncRepository<,>), typeof(AsyncRepository<,>))

        .AddMediatR(this.MediatorAssembly);

      services
        .AddAuthentication(options => {
          options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
          options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options => {
          // Validate using issuer public keys
          var serviceURL = Configuration.GetValue<string>("Service:Cognito:ServiceURL");
          var poolId = Configuration.GetValue<string>("Service:Cognito:PoolId");
          var clientId = Configuration.GetValue<string>("Service:Cognito:ClientId");

          options.TokenValidationParameters = new TokenValidationParameters {
            // https://stackoverflow.com/a/53244447
            ValidateIssuerSigningKey = true,
            IssuerSigningKeyResolver = (s, securityToken, identifier, parameters) => {
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

      services.AddControllers(options =>
        options.Filters.Add(
          new AuthorizeFilter(
            new AuthorizationPolicyBuilder()
              .RequireAuthenticatedUser()
              .Build()))
      )
      .AddJsonOptions(options => {
        options.JsonSerializerOptions.IgnoreNullValues = true;
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
      });
      services.AddCors();
      services.AddSwaggerGen(c => {
        c.SwaggerDoc("v1", new OpenApiInfo { Title = $"Platform8 {this.ServiceName} Api", Version = "v1" });

        c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme {
          Description = @"JWT Authorization header using the Bearer scheme. Enter 'Bearer' [space] and then your token in the text input below.

                        Example: 'Bearer 12345abcdef'",
          Name = "Authorization",
          In = ParameterLocation.Header,
          Type = SecuritySchemeType.ApiKey,
          Scheme = "Bearer"
        });

        c.AddSecurityRequirement(new OpenApiSecurityRequirement()
        {
          {
            new OpenApiSecurityScheme
            {
              Reference = new OpenApiReference
              {
                Type = ReferenceType.SecurityScheme,
                Id = "Bearer"
              },
              Scheme = "oauth2",
              Name = "Bearer",
              In = ParameterLocation.Header,
            },
            new List<string>()
          }
        });
      });
    }
    protected void ConfigureCoreServices(IServiceCollection services) {
      this.AddCoreServices(services);
    }
    protected void ConfigureCoreServices<DbContext>(IServiceCollection services)
      where DbContext : Microsoft.EntityFrameworkCore.DbContext {

      this.AddCoreServices(services);
      this.AddDataContext<DbContext>(services);
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env) {
      if (env.IsDevelopment()) {
        app.UseDeveloperExceptionPage();
        app.UseSwagger();
        app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", $"Platform8 {this.ServiceName} Api v1"));
      }

      app.UseRouting();

      app.UseCors(builder => builder
        //TODO: Secure this...
        // This will allow any origin
        .SetIsOriginAllowed(origin => true)
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials());

      app.UseAuthentication();

      app.UseAuthorization();

      app.UseEndpoints(endpoints => {
        endpoints.MapControllers();
      });
    }
  }
}
