using System;

using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using Microsoft.EntityFrameworkCore;

using ContinuousMigrations;
using MediatR;

using Platform8.Core.Data;
using Platform8.FinancialAccounts.Data;


namespace Platform8.FinancialAccounts.Api
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

      // Service Specific setup
      //

      services
        .AddOptions()
        .AddDefaultAWSOptions(Configuration.GetAWSOptions())
        .AddDbContext<FinancialAccountsDataContext>(options =>
          options.UseMySql(Configuration.GetConnectionString("DefaultConnection"),
                           new MySqlServerVersion(new Version(5, 7)),
                           x => x.MigrationsAssembly("FinancialAccounts.Api")))
        .AddContinuousMigrations<FinancialAccountsDataContext>()

        .AddScoped(typeof(IAsyncRepository<,>), typeof(AsyncRepository<,>))

        .AddMediatR(FinancialAccounts.Commands.CommandsAssembly.Value);

      //
      // *****************************

      services.AddControllers();
      services.AddSwaggerGen(c =>
      {
        c.SwaggerDoc("v1", new OpenApiInfo { Title = "Platform8 Financial Accounts Api", Version = "v1" });
      });
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
      if (env.IsDevelopment())
      {
        app.UseDeveloperExceptionPage();
        app.UseSwagger();
        app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Platform8 Financial Accounts Api v1"));
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
