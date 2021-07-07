using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Platform8.Core.Data
{
  public class AsyncRepository<TContext, TEntity> : IAsyncRepository<TContext, TEntity>
    where TEntity : class, IEntity
    where TContext : DbContext
  {

    private ILogger logger;

    public AsyncRepository(TContext context, ILogger<AsyncRepository<TContext, TEntity>> logger)
    {
      this.logger = logger;
      this.Context = context;
    }

    public DbContext Context { get; set; }

    public async Task<IReadOnlyList<TEntity>> ListAllAsync(CancellationToken cancellationToken = default)
    {
      return await this.Context.Set<TEntity>().ToListAsync(cancellationToken);
    }

    public Task<IReadOnlyList<TResult>> ListAsync<TResult>(IQuerySpec<TEntity, TResult> spec, CancellationToken cancellationToken = default)
    {
      return Task.FromResult<IReadOnlyList<TResult>>(spec.Apply(this.Context).Select(spec.Selector).ToList());
    }

    public async Task<IReadOnlyList<TEntity>> ListAsync(IQuerySpec<TEntity> spec, CancellationToken cancellationToken = default)
    {
      return await spec.Apply(this.Context).ToListAsync(cancellationToken);
    }

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
