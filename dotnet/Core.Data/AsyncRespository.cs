using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Platform8.Core.Data
{
  public class AsyncRepository<TContext, TEntity> : IAsyncRepository<TContext, TEntity>
    where TEntity : IEntity
    where TContext : DbContext
  {

    private ILogger logger;

    public AsyncRepository(TContext context, ILogger<AsyncRepository<TContext, TEntity>> logger)
    {
      this.logger = logger;
      this.Context = context;
    }

    public DbContext Context { get; set; }
    public async Task<TEntity> SaveAsync(TEntity entity, CancellationToken cancellationToken)
    {

      var savedEntity = this.Context.Add(entity);
      var result = await this.Context.SaveChangesAsync();

      if (result > 0)
      {
        return (TEntity)savedEntity.Entity;
      }

      //TODO: Log and throw for now...
      var error = $"{entity.GetType().Name} was not saved.";
      this.logger.LogError(error);
      throw new Exception(error);
    }
  }
}
